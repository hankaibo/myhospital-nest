import { Module } from '@nestjs/common';
import { HospitalRepository } from '../hospital.repository';
import { HospitalRelationalRepository } from './repositories/hospital.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalEntity } from './entities/hospital.entity';

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
