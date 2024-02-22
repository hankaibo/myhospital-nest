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

  @Column()
  district: string;

  @Column()
  type: string;

  @Column()
  lvl: string;

  @Column()
  address: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  introduction: string;

  @Column({ type: 'geometry', name: 'lng_lat' })
  lngLat: Point;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
