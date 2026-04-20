import { Injectable, Logger } from '@nestjs/common';
import { StagingHospitalRawRepository } from '../infrastructure/persistence/staging-hospital-raw.repository';
import { SyncStagingHospitalsDto } from '../dto/sync-staging-hospitals.dto';
import { StagingSyncResult } from '../types/staging-sync-result.type';

@Injectable()
export class HospitalStagingSyncService {
  private readonly logger = new Logger(HospitalStagingSyncService.name);

  private fullSyncRunning = false;

  constructor(
    private readonly stagingHospitalRawRepository: StagingHospitalRawRepository,
  ) {}

  async fullSync(dto: SyncStagingHospitalsDto): Promise<StagingSyncResult> {
    if (this.fullSyncRunning) {
      this.logger.warn(
        'Full sync is already running, rejecting duplicate request',
      );
      throw new Error('Full sync is already in progress');
    }

    this.fullSyncRunning = true;
    this.logger.log('Starting full sync...');

    try {
      const result = await this.stagingHospitalRawRepository.fullSync({
        batchId: dto.batchId,
        chunkSize: dto.chunkSize ?? 1000,
      });

      this.logger.log(
        `Full sync done: selected=${result.selected}, synced=${result.synced}, failed=${result.failed}`,
      );

      if (dto.batchId && dto.regionCode) {
        const deletedCount =
          await this.stagingHospitalRawRepository.markDeletedByRegion(
            dto.batchId,
            dto.regionCode,
          );
        result.deletedCount = deletedCount;
        this.logger.log(
          `Soft-deleted ${deletedCount} hospitals for region prefix "${dto.regionCode}"`,
        );
      }

      return result;
    } finally {
      this.fullSyncRunning = false;
    }
  }

  async incrementalSync(
    dto: SyncStagingHospitalsDto,
  ): Promise<StagingSyncResult> {
    const result = await this.stagingHospitalRawRepository.incrementalSync({
      retryFailed: dto.retryFailed ?? false,
      batchId: dto.batchId,
      limit: dto.limit,
    });

    this.logger.log(
      `Incremental sync done: selected=${result.selected}, synced=${result.synced}, failed=${result.failed}`,
    );

    return result;
  }
}
