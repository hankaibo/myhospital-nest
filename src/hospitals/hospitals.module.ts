import { Module } from '@nestjs/common';
import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';
import { RelationalHospitalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalHospitalPersistenceModule],
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}
