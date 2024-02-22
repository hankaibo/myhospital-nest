import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalEntity } from './entities/hospital.entity';
import { HospitalRepository } from '../hospital.repository';
import { HospitalRelationalRepository } from './repositories/hospital.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalEntity])],
  providers: [
    {
      provide: HospitalRepository,
      useClass: HospitalRelationalRepository,
    },
  ],
  exports: [HospitalRepository],
})
export class RelationalHospitalPersistenceModule {}
