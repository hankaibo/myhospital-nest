import { ApiProperty } from '@nestjs/swagger';

export class Hospital {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  institutionCode: string;

  @ApiProperty({ type: String, nullable: true })
  city?: string | null;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, nullable: true })
  typeCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  typeName: string | null;

  @ApiProperty({ type: String, nullable: true })
  levelCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  levelName: string | null;

  @ApiProperty({ type: String, nullable: true })
  hospitalGradeCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  address: string | null;

  @ApiProperty({ type: String, nullable: true })
  regionCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  district: string | null;

  @ApiProperty({ type: Number, nullable: true })
  lng: number | null;

  @ApiProperty({ type: Number, nullable: true })
  lat: number | null;

  @ApiProperty({ type: String, nullable: true })
  socialCreditCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  nature: string | null;

  @ApiProperty({ type: Boolean, nullable: true })
  electronicInsuranceEnabled: boolean | null;

  @ApiProperty({ type: Object, nullable: true })
  businessCapabilityLevels: Record<string, any> | null;

  @ApiProperty({ type: String, nullable: true })
  zipCode: string | null;

  @ApiProperty({ type: String, nullable: true })
  introduction: string | null;

  @ApiProperty({ type: String })
  sourceMethod: string;

  @ApiProperty({ type: Object, nullable: true })
  rawPayload: Record<string, any> | null;

  @ApiProperty({ type: Boolean })
  addressValid: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: Date, nullable: true })
  deletedAt?: Date | null;
}
