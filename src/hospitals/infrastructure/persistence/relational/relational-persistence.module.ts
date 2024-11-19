import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HospitalRepository } from '../hospital.repository';
import { HospitalRelationalRepository } from './repositories/hospital.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalEntity } from './entities/hospital.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([HospitalEntity]),
  ],
  providers: [
    {
      provide: HospitalRepository,
      useClass: HospitalRelationalRepository,
    },
  ],
  exports: [HospitalRepository],
})
export class RelationalHospitalPersistenceModule {}
