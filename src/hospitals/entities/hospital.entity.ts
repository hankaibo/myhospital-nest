import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';

@Entity({
  name: 'hospital',
})
export class HospitalEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: true })
  name: string | null;

  @Column({ type: String, nullable: true })
  code: string | null;

  @Column({ type: String, nullable: true })
  district: string | null;

  @Column({ type: String, nullable: true })
  type: string | null;

  @Column({ type: String, nullable: true })
  lvl: string | null;

  @Column({ type: String, nullable: true })
  address: string | null;

  @Column({ name: 'zip_code', type: String, nullable: true })
  zipCode: string | null;

  @Column({ type: String, nullable: true })
  introduction: string | null;

  @Column({ type: 'geometry', name: 'lng_lat', nullable: true })
  lngLat: Point;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
