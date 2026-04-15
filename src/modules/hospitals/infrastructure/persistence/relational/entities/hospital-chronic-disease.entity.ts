import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../../shared/utils/relational-entity-helper';

@Entity({ name: 'hospital_chronic_disease' })
@Index(
  'uq_hospital_chronic_disease_institution_code_disease_code',
  ['institutionCode', 'diseaseCode'],
  {
    unique: true,
  },
)
export class HospitalChronicDiseaseEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'institution_code', type: 'varchar', length: 30 })
  institutionCode: string;

  @Column({ name: 'disease_code', type: 'varchar', length: 20 })
  diseaseCode: string;

  @Column({
    name: 'disease_name',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  diseaseName: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
