import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { HospitalEntity } from '../entities/hospital.entity';
import { NullableType } from '../../../../../../shared/utils/types/nullable.type';
import { Hospital } from '../../../../domain/hospital';
import { HospitalRepository } from '../../hospital.repository';
import { HospitalMapper } from '../mappers/hospital.mapper';
import { IPaginationOptions } from '../../../../../../shared/utils/types/pagination-options';
import { ICircleOptions } from '../../../../../../shared/utils/types/circle-options';
import {
  SortHospitalDto,
  FilterHospitalDto,
} from '../../../../dto/find-all-hospitals.dto';

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
    filterOptions,
    paginationOptions,
  }: {
    sortOptions?: SortHospitalDto[] | null;
    filterOptions?: FilterHospitalDto | null;
    paginationOptions: IPaginationOptions;
  }): Promise<[Hospital[], number]> {
    const where: FindOptionsWhere<HospitalEntity> = {};
    if (filterOptions?.institutionCode) {
      where.institutionCode = filterOptions.institutionCode;
    }
    if (filterOptions?.name) {
      where.name = filterOptions.name;
    }
    if (filterOptions?.typeCode) {
      where.typeCode = filterOptions.typeCode;
    }
    if (filterOptions?.levelCode) {
      where.levelCode = filterOptions.levelCode;
    }

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
      .where('hospital.lng_lat IS NOT NULL')
      .andWhere(
        `
        ST_DWithin(
          hospital.lng_lat::geography,
          ST_SetSRID(ST_MakePoint(:longitude,:latitude),4326)::geography,
          :radius
        )
      `,
      )
      .setParameters({
        longitude,
        latitude,
        radius,
      })
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

  async delete(id: Hospital['id']): Promise<void> {
    await this.hospitalRepository.delete(id);
  }

  async copy(id: Hospital['id']): Promise<Hospital> {
    const entity = await this.hospitalRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    // 创建一个新实体，复制所需的字段，但不复制 id
    const rest = this.omit(entity, ['id', 'updatedAt', 'createdAt']);

    const newEntity = await this.hospitalRepository.save(
      this.hospitalRepository.create(rest),
    );

    return HospitalMapper.toDomain(newEntity);
  }

  async copyAll(separator: string): Promise<void> {
    // const SAVE_BATCH_SIZE = 1000; // 每次保存到数据库的医院数
    // const updatedHospitals: HospitalEntity[] = [];

    // // 获取数据库流
    // const stream = await this.hospitalRepository
    //   .createQueryBuilder('hospital')
    //   .select([
    //     'hospital.name',
    //     'hospital.code',
    //     'hospital.type',
    //     'hospital.lvl',
    //     'hospital.address',
    //     'hospital.introduction',
    //   ])
    //   .stream();

    // return new Promise((resolve, reject) => {
    //   stream.on('data', async (row: Partial<HospitalEntity>) => {
    //     const hospital = row; // 每次读取一条记录
    //     if (hospital.address?.includes('、')) {
    //       const newAddresses = hospital.address.split('、');

    //       for (const address of newAddresses) {
    //         hospital.address = address;
    //         const newEntity = this.hospitalRepository.create(hospital);
    //         updatedHospitals.push(newEntity);

    //         // 每 SAVE_BATCH_SIZE 个保存一次
    //         if (updatedHospitals.length >= SAVE_BATCH_SIZE) {
    //           await this.hospitalRepository.save(updatedHospitals);
    //           updatedHospitals.length = 0; // 清空临时存储
    //         }
    //       }
    //     }
    //   });

    //   stream.on('end', async () => {
    //     // 保存剩余的医院
    //     if (updatedHospitals.length > 0) {
    //       await this.hospitalRepository.save(updatedHospitals);
    //     }
    //     console.log('Stream processing completed.');
    //     resolve();
    //   });

    //   stream.on('error', (error) => {
    //     console.error('Error during stream processing:', error);
    //     reject(error);
    //   });
    // });

    // ---------------------------------------------------------------
    const hospitals = await this.hospitalRepository
      .createQueryBuilder('hospital')
      .where('hospital.address LIKE :pattern', { pattern: `%${separator}%` })
      .getMany();

    if (!hospitals.length) {
      return;
    }

    const SAVE_BATCH_SIZE = 1000; // 每次保存到数据库的医院数
    const updatedHospitals: HospitalEntity[] = [];
    const idsToDelete: string[] = []; // 用于记录需要删除的医院ID

    for (const hospital of hospitals) {
      const newAddresses = hospital.address?.split(separator) || [];

      for (const address of newAddresses) {
        const rest = this.omit(hospital, [
          'id',
          'lngLat',
          'address',
          'updatedAt',
          'createdAt',
        ]);
        rest.address = address;
        const newEntity = this.hospitalRepository.create(rest);
        updatedHospitals.push(newEntity);

        // 每 SAVE_BATCH_SIZE 个保存一次
        if (updatedHospitals.length >= SAVE_BATCH_SIZE) {
          await this.hospitalRepository.save(updatedHospitals);
          updatedHospitals.length = 0; // 清空临时存储
        }
      }
      // 将当前医院的 ID 加入待删除列表
      idsToDelete.push(hospital.id);
    }

    // 保存剩余的医院
    if (updatedHospitals.length > 0) {
      await this.hospitalRepository.save(updatedHospitals);
    }

    // 删除包含多个地址的原始记录
    if (idsToDelete.length > 0) {
      await this.hospitalRepository.delete(idsToDelete);
    }
  }

  omit<T>(obj: T, keys: (keyof T)[]): Partial<T> {
    const newObj = { ...obj };
    keys.forEach((key) => {
      delete newObj[key];
    });
    return newObj;
  }
}
