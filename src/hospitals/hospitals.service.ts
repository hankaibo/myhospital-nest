import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalRepository } from './infrastructure/persistence/hospital.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ICircleOptions } from '../utils/types/circle-options';
import { Hospital } from './domain/hospital';

@Injectable()
export class HospitalsService {
  constructor(
    // Dependencies here
    private readonly hospitalRepository: HospitalRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createHospitalDto: CreateHospitalDto,
  ) {
    // Do not remove comment below.
    // <creating-property />
    return this.hospitalRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.hospitalRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Hospital['id']) {
    return this.hospitalRepository.findById(id);
  }

  findByIds(ids: Hospital['id'][]) {
    return this.hospitalRepository.findByIds(ids);
  }

  findByCircle({ circleOptions }: { circleOptions: ICircleOptions }) {
    return this.hospitalRepository.findByCircle({
      circleOptions: {
        latitude: circleOptions.latitude,
        longitude: circleOptions.longitude,
        radius: circleOptions.radius,
      },
    });
  }

  async update(
    id: Hospital['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateHospitalDto: UpdateHospitalDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    return this.hospitalRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Hospital['id']) {
    return this.hospitalRepository.remove(id);
  }
}
