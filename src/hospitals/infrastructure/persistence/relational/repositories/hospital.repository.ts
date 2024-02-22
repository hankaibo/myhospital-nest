import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../../hospital.repository';
import { Hospital } from 'src/hospitals/domain/hospital';
import { QueryHospitalDto } from 'src/hospitals/dto/query-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalEntity } from '../entities/hospital.entity';
import { Repository } from 'typeorm';
import { HospitalMapper } from '../mappers/hospital.mapper';

@Injectable()
export class HospitalRelationalRepository implements HospitalRepository {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalsRepository: Repository<HospitalEntity>,
  ) {}

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

    return entities.map((hospital) => HospitalMapper.toDomain(hospital));
  }
}
