import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';
import { StagingHospitalRawEntity } from '../entities/staging-hospital-raw.entity';
import { HospitalEntity } from '../entities/hospital.entity';
import { HospitalChronicDiseaseEntity } from '../entities/hospital-chronic-disease.entity';
import { HospitalAddressGeocodingEntity } from '../entities/hospital-address-geocoding.entity';
import { StagingHospitalRawRepository } from '../../staging-hospital-raw.repository';
import { StagingSyncResult } from '../../../../types/staging-sync-result.type';

type NormalizedHospitalPayload = Record<string, any>;

@Injectable()
export class StagingHospitalRawRelationalRepository implements StagingHospitalRawRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(StagingHospitalRawEntity)
    private readonly stagingRepository: Repository<StagingHospitalRawEntity>,
  ) {}

  async sync(options: {
    retryFailed: boolean;
    batchId?: string;
    limit?: number;
  }): Promise<StagingSyncResult> {
    const statuses = options.retryFailed ? ['pending', 'failed'] : ['pending'];
    const stagingRows = await this.stagingRepository.find({
      where: {
        syncStatus: In(statuses),
        ...(options.batchId ? { crawlBatchId: options.batchId } : {}),
      },
      order: { id: 'ASC' },
      take: options.limit ?? 500,
    });

    const result: StagingSyncResult = {
      selected: stagingRows.length,
      synced: 0,
      failed: 0,
    };

    for (const row of stagingRows) {
      try {
        await this.dataSource.transaction(async (manager) => {
          await this.syncOne(manager, row);
        });
        result.synced += 1;
      } catch (error) {
        result.failed += 1;
        await this.stagingRepository.update(row.id, {
          syncStatus: 'failed',
          syncError: this.toErrorMessage(error),
        });
      }
    }

    return result;
  }

  private async syncOne(
    manager: EntityManager,
    stagingRow: StagingHospitalRawEntity,
  ): Promise<void> {
    const payload = stagingRow.normalizedPayload;
    const institutionCode = this.toNullableString(payload.institution_code);

    if (!institutionCode) {
      throw new Error('normalized_payload.institution_code is required');
    }

    const address = this.toNullableString(payload.address);
    const hospitalRepository = manager.getRepository(HospitalEntity);
    const chronicDiseaseRepository = manager.getRepository(
      HospitalChronicDiseaseEntity,
    );
    const geocodingRepository = manager.getRepository(
      HospitalAddressGeocodingEntity,
    );
    const stagingRepository = manager.getRepository(StagingHospitalRawEntity);

    const existingHospital = await hospitalRepository.findOne({
      where: {
        institutionCode,
        address: address ?? IsNull(),
      },
    });

    const hospitalEntity = hospitalRepository.create({
      ...(existingHospital ?? {}),
      institutionCode,
      name: this.toRequiredString(payload.name, 'normalized_payload.name'),
      typeCode: this.toNullableString(payload.type_code),
      typeName: this.toNullableString(payload.type_name),
      levelCode: this.toNullableString(payload.level_code),
      levelName: this.toNullableString(payload.level_name),
      hospitalGradeCode: this.toNullableString(payload.hospital_grade_code),
      address,
      regionCode: this.toNullableString(payload.region_code),
      city: this.toNullableString(payload.city),
      district: this.toNullableString(payload.district),
      lat: this.toNullableNumericString(payload.lat),
      lng: this.toNullableNumericString(payload.lng),
      socialCreditCode: this.toNullableString(payload.social_credit_code),
      nature: this.toNullableString(payload.nature),
      electronicInsuranceEnabled: this.toNullableBoolean(
        payload.electronic_insurance_enabled,
      ),
      businessCapabilityLevels:
        (payload.business_capability_levels as Record<string, any>) ?? null,
      zipCode: this.toNullableString(payload.zip_code),
      introduction: this.toNullableString(payload.introduction),
      sourceMethod:
        this.toNullableString(payload.source_method) ?? stagingRow.sourceMethod,
      rawPayload:
        (payload.raw_payload as Record<string, any>) ?? stagingRow.rawPayload,
      addressValid: this.toNullableBoolean(payload.address_valid) ?? true,
    });

    const savedHospital = await hospitalRepository.save(hospitalEntity);

    await this.replaceChronicDiseases(
      chronicDiseaseRepository,
      institutionCode,
      payload.chronic_diseases,
    );
    await this.upsertGeocoding(geocodingRepository, savedHospital.id, payload);

    await stagingRepository.update(stagingRow.id, {
      syncStatus: 'synced',
      syncError: null,
      syncedAt: new Date(),
    });
  }

  private async replaceChronicDiseases(
    repository: Repository<HospitalChronicDiseaseEntity>,
    institutionCode: string,
    diseases: unknown,
  ): Promise<void> {
    await repository.delete({ institutionCode });

    if (!Array.isArray(diseases) || diseases.length === 0) {
      return;
    }

    const deduplicated = new Map<string, HospitalChronicDiseaseEntity>();

    for (const disease of diseases) {
      if (!disease || typeof disease !== 'object') {
        continue;
      }

      const diseaseCode = this.toNullableString(
        (disease as Record<string, unknown>).disease_code,
      );
      if (!diseaseCode) {
        continue;
      }

      deduplicated.set(
        diseaseCode,
        repository.create({
          institutionCode,
          diseaseCode,
          diseaseName:
            this.toNullableString(
              (disease as Record<string, unknown>).disease_name,
            ) ?? '',
        }),
      );
    }

    if (deduplicated.size > 0) {
      await repository.save([...deduplicated.values()]);
    }
  }

  private async upsertGeocoding(
    repository: Repository<HospitalAddressGeocodingEntity>,
    hospitalId: string,
    payload: NormalizedHospitalPayload,
  ): Promise<void> {
    const geocodingConfidence = this.toNullableString(
      payload.geocoding_confidence,
    );
    const geocodingPoiType = this.toNullableString(payload.geocoding_poi_type);
    const geocodingFailed = this.toNullableBoolean(payload.geocoding_failed);
    const hasGeocodingMetadata =
      geocodingConfidence !== null ||
      geocodingPoiType !== null ||
      geocodingFailed === true ||
      this.toNullableString(payload.original_address) !== null ||
      Array.isArray(payload.additional_addresses);

    if (!hasGeocodingMetadata) {
      return;
    }

    const existing = await repository.findOne({ where: { hospitalId } });
    const entity = repository.create({
      ...(existing ?? {}),
      hospitalId,
      geocodingConfidence,
      geocodingPoiType,
      geocodingMultiple:
        this.toNullableBoolean(payload.geocoding_multiple) ?? false,
      originalAddress: this.toNullableString(payload.original_address),
      additionalAddresses: Array.isArray(payload.additional_addresses)
        ? payload.additional_addresses
        : null,
      geocodingFailed: geocodingFailed ?? false,
      geocodingError: this.toNullableString(payload.geocoding_error),
    });

    await repository.save(entity);
  }

  private toNullableString(value: unknown): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return String(value);
  }

  private toRequiredString(value: unknown, field: string): string {
    const normalized = this.toNullableString(value);
    if (!normalized) {
      throw new Error(`${field} is required`);
    }

    return normalized;
  }

  private toNullableBoolean(value: unknown): boolean | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value !== 0;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['1', 'true', 'yes', 'y'].includes(normalized)) {
        return true;
      }
      if (['0', 'false', 'no', 'n'].includes(normalized)) {
        return false;
      }
    }

    return null;
  }

  private toNullableNumericString(value: unknown): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numericValue =
      typeof value === 'number' ? value : Number.parseFloat(String(value));

    if (Number.isNaN(numericValue)) {
      return null;
    }

    return String(numericValue);
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message.slice(0, 2000);
    }

    return String(error).slice(0, 2000);
  }
}
