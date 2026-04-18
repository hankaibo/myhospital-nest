import { StagingSyncResult } from '../../types/staging-sync-result.type';

export abstract class StagingHospitalRawRepository {
  abstract fullSync(options: {
    batchId?: string;
    chunkSize?: number;
  }): Promise<StagingSyncResult>;

  abstract incrementalSync(options: {
    retryFailed: boolean;
    batchId?: string;
    limit?: number;
  }): Promise<StagingSyncResult>;

  abstract markDeletedByRegion(
    batchId: string,
    regionPrefix: string,
  ): Promise<number>;
}
