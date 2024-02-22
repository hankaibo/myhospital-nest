import { Injectable } from '@nestjs/common';
import { HospitalRepository } from './infrastructure/persistence/hospital.repository';
import { Hospital } from './domain/hospital';
import { QueryHospitalDto } from './dto/query-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(private readonly hospitalsRepository: HospitalRepository) {}

  findManyWithCircle({
    circleOptions,
  }: {
    circleOptions: QueryHospitalDto;
  }): Promise<Hospital[]> {
    return this.hospitalsRepository.findManyWithCircle({ circleOptions });
  }
}
