import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { HospitalEntity } from './entities/hospital.entity';
import { QueryHospitalDto, SortHospitalDto } from './dto/query-hospital.dto';

import { IPaginationOptions } from '../utils/types/pagination-options';
import { Hospital } from './domain/hospital';
import { HospitalMapper } from './mappers/hospital.mapper';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalsRepository: Repository<HospitalEntity>,
  ) {}

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortHospitalDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Hospital[]> {
    const where: FindOptionsWhere<HospitalEntity> = {};

    const entities = await this.hospitalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((hospitalEntity) =>
      HospitalMapper.toDomain(hospitalEntity),
    );
  }

  async findManyWithCircle({
    circleOptions,
  }: {
    circleOptions: QueryHospitalDto;
  }): Promise<Hospital[]> {
    const { longitude, latitude, radius } = circleOptions;

    const entities = await this.hospitalsRepository
      .createQueryBuilder('hospital')
      .where(
        `ST_DistanceSphere(hospital.lng_lat, ST_MakePoint(:longitude, :latitude)) <= :radius`,
        {
          longitude,
          latitude,
          radius,
        },
      )
      .getMany();

    return entities.map((hospitalEntity) =>
      HospitalMapper.toDomain(hospitalEntity),
    );
  }
}
