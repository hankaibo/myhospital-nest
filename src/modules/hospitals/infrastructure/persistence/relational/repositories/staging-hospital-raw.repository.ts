import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StagingHospitalRawRepository } from '../../staging-hospital-raw.repository';
import { StagingSyncResult } from '../../../../types/staging-sync-result.type';

const HOSPITAL_UPSERT_SQL = `
  INSERT INTO hospital (
    institution_code, name, type_code, type_name, level_code, level_name,
    hospital_grade_code, address, region_code, city, district, lat, lng, lng_lat,
    social_credit_code, nature, electronic_insurance_enabled,
    business_capability_levels, zip_code, introduction, source_method,
    raw_payload, address_valid
  )
  SELECT
    (s.normalized_payload->>'institution_code')::varchar(30),
    (s.normalized_payload->>'name')::varchar(255),
    NULLIF(s.normalized_payload->>'type_code', '')::varchar(20),
    NULLIF(s.normalized_payload->>'type_name', '')::varchar(100),
    NULLIF(s.normalized_payload->>'level_code', '')::varchar(10),
    NULLIF(s.normalized_payload->>'level_name', '')::varchar(50),
    NULLIF(s.normalized_payload->>'hospital_grade_code', '')::varchar(10),
    NULLIF(s.normalized_payload->>'address', '')::text,
    NULLIF(s.normalized_payload->>'region_code', '')::varchar(20),
    NULLIF(s.normalized_payload->>'city', '')::varchar(50),
    NULLIF(s.normalized_payload->>'district', '')::varchar(50),
    NULLIF(s.normalized_payload->>'lat', '')::numeric(12,8),
    NULLIF(s.normalized_payload->>'lng', '')::numeric(12,8),
    CASE
      WHEN s.normalized_payload->>'lng' IS NOT NULL
        AND s.normalized_payload->>'lat' IS NOT NULL
      THEN ST_SetSRID(ST_MakePoint(
        (s.normalized_payload->>'lng')::float8,
        (s.normalized_payload->>'lat')::float8
      ), 4326)::geography
      ELSE NULL
    END,
    NULLIF(s.normalized_payload->>'social_credit_code', '')::varchar(30),
    NULLIF(s.normalized_payload->>'nature', '')::varchar(10),
    NULLIF(s.normalized_payload->>'electronic_insurance_enabled', '')::boolean,
    s.normalized_payload->'business_capability_levels',
    NULLIF(s.normalized_payload->>'zip_code', '')::varchar(10),
    NULLIF(s.normalized_payload->>'introduction', '')::text,
    COALESCE(NULLIF(s.normalized_payload->>'source_method', ''), s.source_method)::varchar(20),
    COALESCE(s.normalized_payload->'raw_payload', s.raw_payload),
    COALESCE((NULLIF(s.normalized_payload->>'address_valid', ''))::boolean, true)
  FROM staging_hospital_raw s
  WHERE s.id = ANY($1)
    AND s.normalized_payload->>'institution_code' IS NOT NULL
    AND s.normalized_payload->>'institution_code' != ''
    AND s.normalized_payload->>'name' IS NOT NULL
    AND s.normalized_payload->>'name' != ''
  ON CONFLICT (institution_code, address_key)
  DO UPDATE SET
    name = EXCLUDED.name,
    type_code = EXCLUDED.type_code,
    type_name = EXCLUDED.type_name,
    level_code = EXCLUDED.level_code,
    level_name = EXCLUDED.level_name,
    hospital_grade_code = EXCLUDED.hospital_grade_code,
    address = EXCLUDED.address,
    region_code = EXCLUDED.region_code,
    city = EXCLUDED.city,
    district = EXCLUDED.district,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    lng_lat = EXCLUDED.lng_lat,
    social_credit_code = EXCLUDED.social_credit_code,
    nature = EXCLUDED.nature,
    electronic_insurance_enabled = EXCLUDED.electronic_insurance_enabled,
    business_capability_levels = EXCLUDED.business_capability_levels,
    zip_code = EXCLUDED.zip_code,
    introduction = EXCLUDED.introduction,
    source_method = EXCLUDED.source_method,
    raw_payload = EXCLUDED.raw_payload,
    address_valid = EXCLUDED.address_valid,
    updated_at = CURRENT_TIMESTAMP,
    deleted_at = NULL
`;

const CHRONIC_DISEASE_DELETE_SQL = `
  DELETE FROM hospital_chronic_disease
  WHERE institution_code IN (
    SELECT DISTINCT s.normalized_payload->>'institution_code'
    FROM staging_hospital_raw s
    WHERE s.id = ANY($1)
      AND s.normalized_payload->>'institution_code' IS NOT NULL
  )
`;

const CHRONIC_DISEASE_INSERT_SQL = `
  INSERT INTO hospital_chronic_disease (institution_code, disease_code, disease_name)
  SELECT DISTINCT ON (s.normalized_payload->>'institution_code', d->>'disease_code')
    s.normalized_payload->>'institution_code',
    d->>'disease_code',
    COALESCE(d->>'disease_name', '')
  FROM staging_hospital_raw s
  CROSS JOIN jsonb_array_elements(s.normalized_payload->'chronic_diseases') AS d
  WHERE s.id = ANY($1)
    AND s.normalized_payload->'chronic_diseases' IS NOT NULL
    AND jsonb_typeof(s.normalized_payload->'chronic_diseases') = 'array'
    AND d->>'disease_code' IS NOT NULL
    AND d->>'disease_code' != ''
`;

const GEOCODING_UPSERT_SQL = `
  INSERT INTO hospital_address_geocoding (
    hospital_id, geocoding_confidence, geocoding_poi_type, geocoding_multiple,
    original_address, additional_addresses, geocoding_failed, geocoding_error
  )
  SELECT
    h.id,
    NULLIF(s.normalized_payload->>'geocoding_confidence', '')::varchar(20),
    NULLIF(s.normalized_payload->>'geocoding_poi_type', '')::varchar(50),
    COALESCE((s.normalized_payload->>'geocoding_multiple')::boolean, false),
    NULLIF(s.normalized_payload->>'original_address', '')::text,
    s.normalized_payload->'additional_addresses',
    COALESCE((s.normalized_payload->>'geocoding_failed')::boolean, false),
    NULLIF(s.normalized_payload->>'geocoding_error', '')::text
  FROM staging_hospital_raw s
  JOIN hospital h ON h.institution_code = s.normalized_payload->>'institution_code'
    AND h.address_key = COALESCE(UPPER(TRIM(REGEXP_REPLACE(s.normalized_payload->>'address', '\\s+', ' ', 'g'))), '')
  WHERE s.id = ANY($1)
    AND (
      s.normalized_payload->>'geocoding_confidence' IS NOT NULL
      OR s.normalized_payload->>'geocoding_poi_type' IS NOT NULL
      OR s.normalized_payload->>'original_address' IS NOT NULL
      OR s.normalized_payload->'additional_addresses' IS NOT NULL
      OR (s.normalized_payload->>'geocoding_failed')::boolean IS TRUE
    )
  ON CONFLICT (hospital_id)
  DO UPDATE SET
    geocoding_confidence = EXCLUDED.geocoding_confidence,
    geocoding_poi_type = EXCLUDED.geocoding_poi_type,
    geocoding_multiple = EXCLUDED.geocoding_multiple,
    original_address = EXCLUDED.original_address,
    additional_addresses = EXCLUDED.additional_addresses,
    geocoding_failed = EXCLUDED.geocoding_failed,
    geocoding_error = EXCLUDED.geocoding_error
`;

const MARK_SYNCED_SQL = `
  UPDATE staging_hospital_raw
  SET sync_status = 'synced', sync_error = NULL, synced_at = CURRENT_TIMESTAMP
  WHERE id = ANY($1)
`;

const MARK_FAILED_SQL = `
  UPDATE staging_hospital_raw
  SET sync_status = 'failed', sync_error = $2
  WHERE id = ANY($1)
`;

const MARK_INVALID_SQL = `
  UPDATE staging_hospital_raw
  SET sync_status = 'failed', sync_error = 'institution_code or name is missing in normalized_payload'
  WHERE id = ANY($1)
    AND (
      normalized_payload->>'institution_code' IS NULL
      OR normalized_payload->>'institution_code' = ''
      OR normalized_payload->>'name' IS NULL
      OR normalized_payload->>'name' = ''
    )
`;

@Injectable()
export class StagingHospitalRawRelationalRepository implements StagingHospitalRawRepository {
  private readonly logger = new Logger(
    StagingHospitalRawRelationalRepository.name,
  );

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async fullSync(options: {
    batchId?: string;
    chunkSize?: number;
  }): Promise<StagingSyncResult> {
    const chunkSize = options.chunkSize ?? 1000;
    const result: StagingSyncResult = { selected: 0, synced: 0, failed: 0 };
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const stagingIds = await this.selectPendingIds(
        ['pending'],
        options.batchId,
        chunkSize,
        offset,
      );

      if (stagingIds.length === 0) {
        hasMore = false;
        break;
      }

      result.selected += stagingIds.length;
      const chunkResult = await this.syncChunk(stagingIds);
      result.synced += chunkResult.synced;
      result.failed += chunkResult.failed;

      if (stagingIds.length < chunkSize) {
        hasMore = false;
      } else {
        offset += chunkSize;
      }

      this.logger.log(
        `fullSync progress: selected=${result.selected}, synced=${result.synced}, failed=${result.failed}`,
      );
    }

    return result;
  }

  async incrementalSync(options: {
    retryFailed: boolean;
    batchId?: string;
    limit?: number;
  }): Promise<StagingSyncResult> {
    const statuses = options.retryFailed ? ['pending', 'failed'] : ['pending'];
    const limit = options.limit ?? 500;

    const stagingIds = await this.selectPendingIds(
      statuses,
      options.batchId,
      limit,
      0,
    );

    if (stagingIds.length === 0) {
      return { selected: 0, synced: 0, failed: 0 };
    }

    const chunkResult = await this.syncChunk(stagingIds);

    return {
      selected: stagingIds.length,
      synced: chunkResult.synced,
      failed: chunkResult.failed,
    };
  }

  private async selectPendingIds(
    statuses: string[],
    batchId: string | undefined,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    const params: unknown[] = [statuses, limit, offset];
    let batchFilter = '';
    if (batchId) {
      batchFilter = 'AND crawl_batch_id = $4';
      params.push(batchId);
    }

    const rows = await this.dataSource.query(
      `SELECT id FROM staging_hospital_raw
       WHERE sync_status = ANY($1) ${batchFilter}
       ORDER BY id ASC
       LIMIT $2 OFFSET $3`,
      params,
    );

    return rows.map((r: { id: string }) => String(r.id));
  }

  private async syncChunk(stagingIds: string[]): Promise<{
    synced: number;
    failed: number;
  }> {
    const result = { synced: 0, failed: 0 };

    await this.markInvalidRows(stagingIds);

    const validIds = await this.getValidIds(stagingIds);
    if (validIds.length === 0) {
      result.failed = stagingIds.length;
      return result;
    }

    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.query(HOSPITAL_UPSERT_SQL, [validIds]);
        await manager.query(CHRONIC_DISEASE_DELETE_SQL, [validIds]);
        await manager.query(CHRONIC_DISEASE_INSERT_SQL, [validIds]);
        await manager.query(GEOCODING_UPSERT_SQL, [validIds]);
        await manager.query(MARK_SYNCED_SQL, [validIds]);
      });
      result.synced = validIds.length;
    } catch (error) {
      this.logger.error(
        `Bulk sync failed, falling back to row-by-row: ${this.toErrorMessage(error)}`,
      );
      const fallbackResult = await this.syncRowByRow(validIds);
      result.synced = fallbackResult.synced;
      result.failed += fallbackResult.failed;
    }

    const invalidCount = stagingIds.length - validIds.length;
    result.failed += invalidCount;

    return result;
  }

  private async syncRowByRow(
    stagingIds: string[],
  ): Promise<{ synced: number; failed: number }> {
    const result = { synced: 0, failed: 0 };

    for (const id of stagingIds) {
      try {
        await this.dataSource.transaction(async (manager) => {
          await manager.query(HOSPITAL_UPSERT_SQL, [[id]]);
          await manager.query(CHRONIC_DISEASE_DELETE_SQL, [[id]]);
          await manager.query(CHRONIC_DISEASE_INSERT_SQL, [[id]]);
          await manager.query(GEOCODING_UPSERT_SQL, [[id]]);
          await manager.query(MARK_SYNCED_SQL, [[id]]);
        });
        result.synced += 1;
      } catch (error) {
        result.failed += 1;
        await this.dataSource.query(MARK_FAILED_SQL, [
          [id],
          this.toErrorMessage(error),
        ]);
      }
    }

    return result;
  }

  private async markInvalidRows(stagingIds: string[]): Promise<void> {
    await this.dataSource.query(MARK_INVALID_SQL, [stagingIds]);
  }

  private async getValidIds(stagingIds: string[]): Promise<string[]> {
    const rows = await this.dataSource.query(
      `SELECT id FROM staging_hospital_raw
       WHERE id = ANY($1)
         AND sync_status = 'pending'
         AND normalized_payload->>'institution_code' IS NOT NULL
         AND normalized_payload->>'institution_code' != ''
         AND normalized_payload->>'name' IS NOT NULL
         AND normalized_payload->>'name' != ''`,
      [stagingIds],
    );
    return rows.map((r: { id: string }) => String(r.id));
  }

  async markDeletedByRegion(
    batchId: string,
    regionPrefix: string,
  ): Promise<number> {
    const result = await this.dataSource.query(
      `UPDATE hospital
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE region_code LIKE $1 || '%'
         AND deleted_at IS NULL
         AND NOT EXISTS (
           SELECT 1 FROM staging_hospital_raw s
           WHERE s.crawl_batch_id = $2
             AND s.institution_code = hospital.institution_code
             AND COALESCE(UPPER(TRIM(REGEXP_REPLACE(s.normalized_payload->>'address', '\\s+', ' ', 'g'))), '') = hospital.address_key
             AND s.sync_status = 'synced'
         )`,
      [regionPrefix, batchId],
    );

    return result?.[1] ?? 0;
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message.slice(0, 2000);
    }
    return String(error).slice(0, 2000);
  }
}
