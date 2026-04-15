import { StagingSyncResult } from '../../types/staging-sync-result.type';

export abstract class StagingHospitalRawRepository {
  abstract sync(options: {
    retryFailed: boolean;
    batchId?: string;
    limit?: number;
  }): Promise<StagingSyncResult>;
}
