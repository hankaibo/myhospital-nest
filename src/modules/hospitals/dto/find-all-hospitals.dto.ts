import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Hospital } from '../domain/hospital';

export class FilterHospitalDto {
  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 116.397507))
  @IsNumber()
  @IsOptional()
  longitude: number;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 39.908708))
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @IsOptional()
  radius: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  institutionCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  typeCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  levelCode?: string;
}

export class SortHospitalDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Hospital;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryHospitalsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterHospitalDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterHospitalDto)
  filters?: FilterHospitalDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortHospitalDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortHospitalDto)
  sort?: SortHospitalDto[] | null;
}
