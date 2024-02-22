import { QueryHospitalDto } from 'src/hospitals/dto/query-hospital.dto';
import { Hospital } from '../../domain/hospital';

export abstract class HospitalRepository {
  abstract findManyWithCircle({
    circleOptions,
  }: {
    circleOptions: QueryHospitalDto;
  }): Promise<Hospital[]>;
}
