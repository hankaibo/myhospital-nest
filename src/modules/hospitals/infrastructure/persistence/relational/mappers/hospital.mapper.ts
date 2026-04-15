import { Hospital } from '../../../../domain/hospital';
import { HospitalEntity } from '../entities/hospital.entity';

export class HospitalMapper {
  static toDomain(raw: HospitalEntity): Hospital {
    const domainEntity = new Hospital();

    domainEntity.id = raw.id;
    domainEntity.institutionCode = raw.institutionCode;
    domainEntity.city = raw.city ?? null;
    domainEntity.name = raw.name;
    domainEntity.typeCode = raw.typeCode ?? null;
    domainEntity.typeName = raw.typeName ?? null;
    domainEntity.levelCode = raw.levelCode ?? null;
    domainEntity.levelName = raw.levelName ?? null;
    domainEntity.hospitalGradeCode = raw.hospitalGradeCode ?? null;
    domainEntity.regionCode = raw.regionCode ?? null;
    domainEntity.district = raw.district ?? null;
    domainEntity.address = raw.address ?? null;
    domainEntity.socialCreditCode = raw.socialCreditCode ?? null;
    domainEntity.nature = raw.nature ?? null;
    domainEntity.electronicInsuranceEnabled = raw.electronicInsuranceEnabled;
    domainEntity.businessCapabilityLevels =
      raw.businessCapabilityLevels ?? null;
    domainEntity.zipCode = raw.zipCode ?? null;
    domainEntity.introduction = raw.introduction ?? null;
    domainEntity.sourceMethod = raw.sourceMethod;
    domainEntity.rawPayload = raw.rawPayload ?? null;
    domainEntity.addressValid = raw.addressValid ?? true;
    if (raw.lngLat) {
      domainEntity.lng = raw.lngLat.coordinates[0];
      domainEntity.lat = raw.lngLat.coordinates[1];
    } else {
      domainEntity.lng = raw.lng !== null ? Number(raw.lng) : null;
      domainEntity.lat = raw.lat !== null ? Number(raw.lat) : null;
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Hospital): HospitalEntity {
    const persistenceEntity = new HospitalEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.lng !== null && domainEntity.lat !== null) {
      persistenceEntity.lng = String(domainEntity.lng);
      persistenceEntity.lat = String(domainEntity.lat);
      persistenceEntity.lngLat = {
        type: 'Point',
        coordinates: [domainEntity.lng, domainEntity.lat],
      };
    } else {
      persistenceEntity.lng = null;
      persistenceEntity.lat = null;
    }
    persistenceEntity.institutionCode = domainEntity.institutionCode;
    persistenceEntity.city = domainEntity.city ?? null;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.typeCode = domainEntity.typeCode ?? null;
    persistenceEntity.typeName = domainEntity.typeName ?? null;
    persistenceEntity.levelCode = domainEntity.levelCode ?? null;
    persistenceEntity.levelName = domainEntity.levelName ?? null;
    persistenceEntity.hospitalGradeCode =
      domainEntity.hospitalGradeCode ?? null;
    persistenceEntity.regionCode = domainEntity.regionCode ?? null;
    persistenceEntity.district = domainEntity.district ?? null;
    persistenceEntity.address = domainEntity.address ?? null;
    persistenceEntity.socialCreditCode = domainEntity.socialCreditCode ?? null;
    persistenceEntity.nature = domainEntity.nature ?? null;
    persistenceEntity.electronicInsuranceEnabled =
      domainEntity.electronicInsuranceEnabled ?? null;
    persistenceEntity.businessCapabilityLevels =
      domainEntity.businessCapabilityLevels ?? null;
    persistenceEntity.zipCode = domainEntity.zipCode ?? null;
    persistenceEntity.introduction = domainEntity.introduction ?? null;
    persistenceEntity.sourceMethod = domainEntity.sourceMethod;
    persistenceEntity.rawPayload = domainEntity.rawPayload ?? null;
    persistenceEntity.addressValid = domainEntity.addressValid;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    return persistenceEntity;
  }
}
