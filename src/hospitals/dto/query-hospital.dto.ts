import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Hospital } from '../domain/hospital';

export class SortHospitalDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Hospital;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryHospitalDto {
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

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 116.397507))
  @IsNumber()
  @IsOptional()
  longitude: number | string;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 39.908708))
  @IsNumber()
  @IsOptional()
  latitude: number | string;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @IsOptional()
  radius: number | string;

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
