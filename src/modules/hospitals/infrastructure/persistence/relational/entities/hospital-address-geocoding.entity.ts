import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../../shared/utils/relational-entity-helper';
import { HospitalEntity } from './hospital.entity';

@Entity({ name: 'hospital_address_geocoding' })
export class HospitalAddressGeocodingEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hospital_id', type: 'uuid', unique: true })
  hospitalId: string;

  @OneToOne(() => HospitalEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id' })
  hospital: HospitalEntity;

  @Column({
    name: 'geocoding_confidence',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  geocodingConfidence: string | null;

  @Column({
    name: 'geocoding_poi_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  geocodingPoiType: string | null;

  @Column({ name: 'geocoding_multiple', type: 'boolean', default: false })
  geocodingMultiple: boolean;

  @Column({ name: 'original_address', type: 'text', nullable: true })
  originalAddress: string | null;

  @Column({ name: 'additional_addresses', type: 'jsonb', nullable: true })
  additionalAddresses: unknown[] | null;

  @Column({ name: 'geocoding_failed', type: 'boolean', default: false })
  geocodingFailed: boolean;

  @Column({ name: 'geocoding_error', type: 'text', nullable: true })
  geocodingError: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
