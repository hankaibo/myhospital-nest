import { IPaginationOptions } from './types/pagination-options';
import { PaginationResponseDto } from './dto/pagination-response.dto';

export const pagination = <T>(
  data: T[],
  options: IPaginationOptions,
  total: number,
): PaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
    total,
  };
};
