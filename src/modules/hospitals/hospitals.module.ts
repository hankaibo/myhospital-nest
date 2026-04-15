import { Module } from '@nestjs/common';
import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';
import { RelationalHospitalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { HospitalStagingSyncService } from './services/hospital-staging-sync.service';

@Module({
  imports: [
    // import modules, etc.
    RelationalHospitalPersistenceModule,
  ],
  controllers: [HospitalsController],
  providers: [HospitalsService, HospitalStagingSyncService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
