import { Hospital } from 'src/hospitals/domain/hospital';
import { HospitalEntity } from '../entities/hospital.entity';

export class HospitalMapper {
  static toDomain(raw: HospitalEntity): Hospital {
    const hospital = new Hospital();
    hospital.id = raw.id;
    hospital.name = raw.name;
    hospital.code = raw.code;
    hospital.district = raw.district;
    hospital.type = raw.type;
    hospital.lvl = raw.lvl;
    hospital.address = raw.address;
    hospital.zipCode = raw.zipCode;
    if (raw.lngLat?.coordinates) {
      hospital.lng = raw.lngLat.coordinates[0];
      hospital.lat = raw.lngLat.coordinates[1];
    }

    return hospital;
  }
}
