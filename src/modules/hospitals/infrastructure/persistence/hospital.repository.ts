import { DeepPartial } from '../../../../shared/utils/types/deep-partial.type';
import { NullableType } from '../../../../shared/utils/types/nullable.type';
import { IPaginationOptions } from '../../../../shared/utils/types/pagination-options';
import { ICircleOptions } from '../../../../shared/utils/types/circle-options';
import {
  SortHospitalDto,
  FilterHospitalDto,
} from '../../dto/find-all-hospitals.dto';
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
    filterOptions,
    paginationOptions,
  }: {
    sortOptions?: SortHospitalDto[] | null;
    filterOptions?: FilterHospitalDto | null;
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

  abstract copy(id: Hospital['id']): Promise<Hospital>;

  abstract copyAll(separator: string): Promise<void>;

  abstract sync(name: string): Promise<void>;
}
