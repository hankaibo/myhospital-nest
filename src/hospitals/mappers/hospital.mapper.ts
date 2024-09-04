import { Hospital } from '../domain/hospital';
import { HospitalEntity } from '../entities/hospital.entity';

export class HospitalMapper {
  static toDomain(raw: HospitalEntity): Hospital {
    const domainEntity = new Hospital();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.code = raw.code;
    domainEntity.district = raw.district;
    domainEntity.type = raw.type;
    domainEntity.lvl = raw.lvl;
    domainEntity.address = raw.address;
    domainEntity.zipCode = raw.zipCode;
    if (raw.lngLat) {
      domainEntity.lng = 13;
      domainEntity.lat = 12;
    }

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Hospital): HospitalEntity {
    const persistenceEntity = new HospitalEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.code = domainEntity.code;
    persistenceEntity.district = domainEntity.district;
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.lvl = domainEntity.lvl;
    persistenceEntity.address = domainEntity.address;
    persistenceEntity.zipCode = domainEntity.zipCode;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
