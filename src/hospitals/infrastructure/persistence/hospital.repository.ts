import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { ICircleOptions } from '../../../utils/types/circle-options';
import { SortHospitalDto } from '../../dto/find-all-hospitals.dto';
import { Hospital } from '../../domain/hospital';

export abstract class HospitalRepository {
  abstract create(
    data: Omit<Hospital, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Hospital>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Hospital[]>;

  abstract findAllAndCountWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortHospitalDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<[Hospital[], number]>;

  abstract findById(id: Hospital['id']): Promise<NullableType<Hospital>>;

  abstract findByIds(ids: Hospital['id'][]): Promise<Hospital[]>;

  abstract findByCircle({
    circleOptions,
  }: {
    circleOptions: ICircleOptions;
  }): Promise<Hospital[]>;

  abstract update(
    id: Hospital['id'],
    payload: DeepPartial<Hospital>,
  ): Promise<Hospital | null>;

  abstract remove(id: Hospital['id']): Promise<void>;
}
