import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../../shared/utils/relational-entity-helper';

@Entity({ name: 'staging_hospital_raw' })
export class StagingHospitalRawEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Index('idx_staging_hospital_raw_batch_id')
  @Column({ name: 'crawl_batch_id', type: 'uuid' })
  crawlBatchId: string;

  @Column({ name: 'source_spider', type: 'varchar', length: 50 })
  sourceSpider: string;

  @Column({
    name: 'source_method',
    type: 'varchar',
    length: 20,
    default: 'api',
  })
  sourceMethod: string;

  @Index('idx_staging_hospital_raw_institution_code')
  @Column({
    name: 'institution_code',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  institutionCode: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'region_code', type: 'varchar', length: 20, nullable: true })
  regionCode: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  district: string | null;

  @Column({ name: 'raw_payload', type: 'jsonb', nullable: true })
  rawPayload: Record<string, any> | null;

  @Column({ name: 'normalized_payload', type: 'jsonb' })
  normalizedPayload: Record<string, any>;

  @Index('idx_staging_hospital_raw_sync_status')
  @Column({
    name: 'sync_status',
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  syncStatus: string;

  @Column({ name: 'sync_error', type: 'text', nullable: true })
  syncError: string | null;

  @Index('idx_staging_hospital_raw_crawled_at')
  @Column({
    name: 'crawled_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  crawledAt: Date;

  @Column({ name: 'synced_at', type: 'timestamp', nullable: true })
  syncedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
