import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HospitalEntity } from './entities/hospital.entity';
import { QueryHospitalDto } from './dto/query-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(HospitalEntity)
    private readonly hospitalsRepository: Repository<HospitalEntity>,
  ) {}

  async findManyWithCircle({
    circleOptions,
  }: {
    circleOptions: QueryHospitalDto;
  }): Promise<HospitalEntity[]> {
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

    return entities;
  }
}
