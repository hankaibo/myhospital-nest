import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { HospitalEntity } from '../entities/hospital.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Hospital } from '../../../../domain/hospital';
import { HospitalRepository } from '../../hospital.repository';
import { HospitalMapper } from '../mappers/hospital.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { ICircleOptions } from '../../../../../utils/types/circle-options';
import { SortHospitalDto } from '../../../../dto/find-all-hospitals.dto';

@Injectable()
export class HospitalRelationalRepository implements HospitalRepository {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
  ) {}

  async create(data: Hospital): Promise<Hospital> {
    const persistenceModel = HospitalMapper.toPersistence(data);
    const newEntity = await this.hospitalRepository.save(
      this.hospitalRepository.create(persistenceModel),
    );
    return HospitalMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Hospital[]> {
    const entities = await this.hospitalRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => HospitalMapper.toDomain(entity));
  }

  async findAllAndCountWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortHospitalDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<[Hospital[], number]> {
    const where: FindOptionsWhere<HospitalEntity> = {};

    const [entities, total] = await this.hospitalRepository.findAndCount({
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

    return [entities.map((entity) => HospitalMapper.toDomain(entity)), total];
  }

  async findById(id: Hospital['id']): Promise<NullableType<Hospital>> {
    const entity = await this.hospitalRepository.findOne({
      where: { id },
    });

    return entity ? HospitalMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Hospital['id'][]): Promise<Hospital[]> {
    const entities = await this.hospitalRepository.find({
      where: { id: In(ids) },
    });
    return entities.map((entity) => HospitalMapper.toDomain(entity));
  }

  async findByCircle({
    circleOptions,
  }: {
    circleOptions: ICircleOptions;
  }): Promise<Hospital[]> {
    const { longitude, latitude, radius } = circleOptions;

    const entities = await this.hospitalRepository
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

    return entities.map((entity) => HospitalMapper.toDomain(entity));
  }

  async update(
    id: Hospital['id'],
    payload: Partial<Hospital>,
  ): Promise<Hospital> {
    const entity = await this.hospitalRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.hospitalRepository.save(
      this.hospitalRepository.create(
        HospitalMapper.toPersistence({
          ...HospitalMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return HospitalMapper.toDomain(updatedEntity);
  }

  async remove(id: Hospital['id']): Promise<void> {
    await this.hospitalRepository.delete(id);
  }
}
