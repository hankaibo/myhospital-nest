import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHospitalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  institutionCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string | null;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  typeCode?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  typeName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  levelCode?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  levelName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hospitalGradeCode?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  regionCode?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  socialCreditCode?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nature?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  electronicInsuranceEnabled?: boolean | null;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  businessCapabilityLevels?: Record<string, any> | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  introduction?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sourceMethod?: string | null;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  rawPayload?: Record<string, any> | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  addressValid?: boolean | null;
}
