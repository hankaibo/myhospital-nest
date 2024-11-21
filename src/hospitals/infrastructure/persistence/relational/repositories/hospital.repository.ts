import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, map } from 'rxjs';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { HospitalEntity } from '../entities/hospital.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Hospital } from '../../../../domain/hospital';
import { HospitalRepository } from '../../hospital.repository';
import { HospitalMapper } from '../mappers/hospital.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { ICircleOptions } from '../../../../../utils/types/circle-options';
import { SortHospitalDto } from '../../../../dto/find-all-hospitals.dto';
import { AllConfigType } from '../../../../../config/config.type';

@Injectable()
export class HospitalRelationalRepository implements HospitalRepository {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
    private httpService: HttpService,
    private configService: ConfigService<AllConfigType>,
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

  async copyAll(): Promise<void> {
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
    const hospitals = await this.hospitalRepository.find();

    if (!hospitals.length) {
      return;
    }

    const SAVE_BATCH_SIZE = 1000; // 每次保存到数据库的医院数
    const updatedHospitals: HospitalEntity[] = [];

    for (const hospital of hospitals) {
      if (hospital.address?.includes('、')) {
        const newAddresses = hospital.address.split('、');

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
      }
    }

    // 保存剩余的医院
    if (updatedHospitals.length > 0) {
      await this.hospitalRepository.save(updatedHospitals);
    }
  }

  async sync(name: string): Promise<void> {
    const hospitals = await this.hospitalRepository.find();

    const hospitalNoWithLngLat = hospitals.filter(
      (hospital) => !hospital.lngLat,
    );

    if (!hospitalNoWithLngLat.length) {
      return;
    }

    const url = this.configService.get('amap.url', { infer: true }) || '';
    const key = this.configService.get('amap.key', { infer: true });

    const SAVE_BATCH_SIZE = 1000; // 每次保存到数据库的医院数
    const REQUEST_DELAY = 500; // 每秒最多 2 次请求（500 毫秒间隔）

    let updatedHospitals: HospitalEntity[] = [];

    const throttleRequest = async (hospital: HospitalEntity) => {
      const payload = {
        key,
        address: hospital.address,
        city: name,
      };

      try {
        const response = await firstValueFrom(
          this.httpService
            .get(url, { params: payload })
            .pipe(map((res) => res.data)),
        );

        if (
          response.info.toLowerCase() !== 'ok' ||
          Number.parseInt(response.count, 10) !== 1
        ) {
          console.error('Failed to fetch geocode data:', response);
          return;
        }

        const geocode = response.geocodes?.[0];

        if (!geocode || !geocode.location || !geocode.adcode) {
          console.warn(`No geocode data found for hospital: ${hospital.name}`);
          hospital.zipCode = null;
        } else {
          const [lng, lat] = geocode.location.split(',').map(parseFloat);

          // Update geometry field
          hospital.lngLat = {
            type: 'Point',
            coordinates: [lng, lat],
          };

          hospital.zipCode = geocode.adcode;
        }

        updatedHospitals.push(hospital);

        // 每 SAVE_BATCH_SIZE 个保存一次
        if (updatedHospitals.length >= SAVE_BATCH_SIZE) {
          await this.hospitalRepository.save(updatedHospitals);
          updatedHospitals = []; // 清空临时存储
        }
      } catch (error) {
        console.error(
          `Error fetching geocode for hospital: ${hospital.name}`,
          error,
        );
      }
    };

    try {
      for (const hospital of hospitalNoWithLngLat) {
        await throttleRequest(hospital);

        // 每次请求后等待 500 毫秒
        await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
      }

      // 保存剩余的医院
      if (updatedHospitals.length > 0) {
        await this.hospitalRepository.save(updatedHospitals);
      }
    } catch (error) {
      console.error('Error during synchronization:', error);
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
