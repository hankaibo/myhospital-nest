import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { EntityRelationalHelper } from '../../../../../../shared/utils/relational-entity-helper';

@Entity({ name: 'hospital' })
@Index(
  'uq_hospital_institution_code_address_key',
  ['institutionCode', 'addressKey'],
  {
    unique: true,
  },
)
@Index('idx_hospital_region_code', ['regionCode'])
@Index('idx_hospital_deleted_at', ['deletedAt'])
@Index('idx_hospital_name', ['name'])
export class HospitalEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institution_code', type: 'varchar', length: 30 })
  institutionCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'type_code', type: 'varchar', length: 20, nullable: true })
  typeCode: string | null;

  @Column({ name: 'type_name', type: 'varchar', length: 100, nullable: true })
  typeName: string | null;

  @Column({ name: 'level_code', type: 'varchar', length: 10, nullable: true })
  levelCode: string | null;

  @Column({ name: 'level_name', type: 'varchar', length: 50, nullable: true })
  levelName: string | null;

  @Column({
    name: 'hospital_grade_code',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  hospitalGradeCode: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'region_code', type: 'varchar', length: 20, nullable: true })
  regionCode: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  district: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 8, nullable: true })
  lat: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 8, nullable: true })
  lng: string | null;

  @Column({
    name: 'lng_lat',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  lngLat: Point | null;

  @Column({
    name: 'social_credit_code',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  socialCreditCode: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  nature: string | null;

  @Column({
    name: 'electronic_insurance_enabled',
    type: 'boolean',
    nullable: true,
  })
  electronicInsuranceEnabled: boolean | null;

  @Column({ name: 'business_capability_levels', type: 'jsonb', nullable: true })
  businessCapabilityLevels: Record<string, unknown> | null;

  @Column({ name: 'zip_code', type: 'varchar', length: 10, nullable: true })
  zipCode: string | null;

  @Column({ type: 'text', nullable: true })
  introduction: string | null;

  @Column({
    name: 'source_method',
    type: 'varchar',
    length: 20,
    default: 'api',
  })
  sourceMethod: string;

  @Column({ name: 'raw_payload', type: 'jsonb', nullable: true })
  rawPayload: Record<string, unknown> | null;

  @Column({ name: 'address_valid', type: 'boolean', default: true })
  addressValid: boolean;

  @Column({
    name: 'address_key',
    type: 'text',
    asExpression:
      "COALESCE(UPPER(TRIM(REGEXP_REPLACE(address, '[[:space:]]+', ' ', 'g'))), '')",
    generatedType: 'STORED',
  })
  addressKey: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
