import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';
import { HospitalEntity } from './entities/hospital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalEntity])],
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}
