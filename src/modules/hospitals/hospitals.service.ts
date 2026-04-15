import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { HospitalRepository } from './infrastructure/persistence/hospital.repository';
import { IPaginationOptions } from '../../shared/utils/types/pagination-options';
import { ICircleOptions } from '../../shared/utils/types/circle-options';
import {
  SortHospitalDto,
  FilterHospitalDto,
} from './dto/find-all-hospitals.dto';
import { Hospital } from './domain/hospital';
import { HospitalStagingSyncService } from './services/hospital-staging-sync.service';
import { SyncStagingHospitalsDto } from './dto/sync-staging-hospitals.dto';

@Injectable()
export class HospitalsService {
  constructor(
    // Dependencies here
    private readonly hospitalRepository: HospitalRepository,
    private readonly hospitalStagingSyncService: HospitalStagingSyncService,
  ) {}

  async create(createHospitalDto: CreateHospitalDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.hospitalRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      institutionCode: createHospitalDto.institutionCode,
      city: createHospitalDto.city ?? null,
      name: createHospitalDto.name,
      typeCode: createHospitalDto.typeCode ?? null,
      typeName: createHospitalDto.typeName ?? null,
      levelCode: createHospitalDto.levelCode ?? null,
      levelName: createHospitalDto.levelName ?? null,
      hospitalGradeCode: createHospitalDto.hospitalGradeCode ?? null,
      regionCode: createHospitalDto.regionCode ?? null,
      district: createHospitalDto.district ?? null,
      address: createHospitalDto.address ?? null,
      socialCreditCode: createHospitalDto.socialCreditCode ?? null,
      nature: createHospitalDto.nature ?? null,
      electronicInsuranceEnabled:
        createHospitalDto.electronicInsuranceEnabled ?? null,
      businessCapabilityLevels:
        createHospitalDto.businessCapabilityLevels ?? null,
      zipCode: createHospitalDto.zipCode ?? null,
      introduction: createHospitalDto.introduction ?? null,
      lat: createHospitalDto.lat ?? null,
      lng: createHospitalDto.lng ?? null,
      sourceMethod: createHospitalDto.sourceMethod ?? 'api',
      rawPayload: createHospitalDto.rawPayload ?? null,
      addressValid: createHospitalDto.addressValid ?? true,
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
    filterOptions,
    paginationOptions,
  }: {
    sortOptions?: SortHospitalDto[] | null;
    filterOptions?: FilterHospitalDto | null;
    paginationOptions: IPaginationOptions;
  }) {
    return await this.hospitalRepository.findAllAndCountWithPagination({
      sortOptions,
      filterOptions,
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
      institutionCode: updateHospitalDto.institutionCode,
      city: updateHospitalDto.city,
      name: updateHospitalDto.name,
      typeCode: updateHospitalDto.typeCode,
      typeName: updateHospitalDto.typeName,
      levelCode: updateHospitalDto.levelCode,
      levelName: updateHospitalDto.levelName,
      hospitalGradeCode: updateHospitalDto.hospitalGradeCode,
      regionCode: updateHospitalDto.regionCode,
      district: updateHospitalDto.district,
      address: updateHospitalDto.address,
      socialCreditCode: updateHospitalDto.socialCreditCode,
      nature: updateHospitalDto.nature,
      electronicInsuranceEnabled: updateHospitalDto.electronicInsuranceEnabled,
      businessCapabilityLevels: updateHospitalDto.businessCapabilityLevels,
      zipCode: updateHospitalDto.zipCode,
      introduction: updateHospitalDto.introduction,
      lat: updateHospitalDto.lat,
      lng: updateHospitalDto.lng,
      sourceMethod: updateHospitalDto.sourceMethod ?? undefined,
      rawPayload: updateHospitalDto.rawPayload,
      addressValid: updateHospitalDto.addressValid ?? undefined,
    });
  }

  remove(id: Hospital['id']) {
    return this.hospitalRepository.remove(id);
  }

  copy(id: Hospital['id']) {
    return this.hospitalRepository.copy(id);
  }

  copyAll(separator: string) {
    return this.hospitalRepository.copyAll(separator);
  }

  async syncStaging(syncDto: SyncStagingHospitalsDto) {
    return await this.hospitalStagingSyncService.sync(syncDto);
  }
}
