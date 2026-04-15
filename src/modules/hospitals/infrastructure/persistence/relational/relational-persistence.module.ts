import { Module } from '@nestjs/common';
import { HospitalRepository } from '../hospital.repository';
import { HospitalRelationalRepository } from './repositories/hospital.repository';
import { StagingHospitalRawRepository } from '../staging-hospital-raw.repository';
import { StagingHospitalRawRelationalRepository } from './repositories/staging-hospital-raw.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalEntity } from './entities/hospital.entity';
import { HospitalChronicDiseaseEntity } from './entities/hospital-chronic-disease.entity';
import { HospitalAddressGeocodingEntity } from './entities/hospital-address-geocoding.entity';
import { StagingHospitalRawEntity } from './entities/staging-hospital-raw.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HospitalEntity,
      HospitalChronicDiseaseEntity,
      HospitalAddressGeocodingEntity,
      StagingHospitalRawEntity,
    ]),
  ],
  providers: [
    {
      provide: HospitalRepository,
      useClass: HospitalRelationalRepository,
    },
    {
      provide: StagingHospitalRawRepository,
      useClass: StagingHospitalRawRelationalRepository,
    },
  ],
  exports: [HospitalRepository, StagingHospitalRawRepository],
})
export class RelationalHospitalPersistenceModule {}
