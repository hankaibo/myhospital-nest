import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalRepository } from './infrastructure/persistence/hospital.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ICircleOptions } from '../utils/types/circle-options';
import { SortHospitalDto } from './dto/find-all-hospitals.dto';
import { Hospital } from './domain/hospital';

@Injectable()
export class HospitalsService {
  constructor(
    // Dependencies here
    private readonly hospitalRepository: HospitalRepository,
  ) {}

  async create(createHospitalDto: CreateHospitalDto) {
    // Do not remove comment below.
    // <creating-property />
    return this.hospitalRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      name: createHospitalDto.name,
      code: createHospitalDto.code,
      district: createHospitalDto.district,
      type: createHospitalDto.type,
      lvl: createHospitalDto.lvl,
      address: createHospitalDto.address,
      zipCode: createHospitalDto.zipCode,
      introduction: createHospitalDto.introduction,
      lat: createHospitalDto.lat,
      lng: createHospitalDto.lng,
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

  async findAllAndCountWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortHospitalDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    return await this.hospitalRepository.findAllAndCountWithPagination({
      sortOptions,
      paginationOptions,
    });
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

    updateHospitalDto: UpdateHospitalDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    return this.hospitalRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      name: updateHospitalDto.name,
      code: updateHospitalDto.code,
      district: updateHospitalDto.district,
      type: updateHospitalDto.type,
      lvl: updateHospitalDto.lvl,
      address: updateHospitalDto.address,
      zipCode: updateHospitalDto.zipCode,
      introduction: updateHospitalDto.introduction,
      lat: updateHospitalDto.lat,
      lng: updateHospitalDto.lng,
    });
  }

  remove(id: Hospital['id']) {
    return this.hospitalRepository.remove(id);
  }
}
