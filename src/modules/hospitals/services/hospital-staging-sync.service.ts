import { Injectable } from '@nestjs/common';
import { StagingHospitalRawRepository } from '../infrastructure/persistence/staging-hospital-raw.repository';
import { SyncStagingHospitalsDto } from '../dto/sync-staging-hospitals.dto';
import { StagingSyncResult } from '../types/staging-sync-result.type';

@Injectable()
export class HospitalStagingSyncService {
  constructor(
    private readonly stagingHospitalRawRepository: StagingHospitalRawRepository,
  ) {}

  async sync(dto: SyncStagingHospitalsDto): Promise<StagingSyncResult> {
    return this.stagingHospitalRawRepository.sync({
      retryFailed: dto.retryFailed ?? false,
      batchId: dto.batchId,
      limit: dto.limit,
    });
  }
}
