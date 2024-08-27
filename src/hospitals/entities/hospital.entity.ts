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

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: String, nullable: true })
  district: string;

  @Column({ type: String, nullable: true })
  type: string;

  @Column()
  lvl: string;

  @Column({ type: String, nullable: true })
  address: string;

  @Column({ name: 'zip_code', type: String, nullable: true })
  zipCode: string;

  @Column({ type: String, nullable: true })
  introduction: string;

  @Column({ type: 'geometry', name: 'lng_lat', nullable: true })
  lngLat: Point;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
