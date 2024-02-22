import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryHospitalDto {
  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 116.397507))
  @IsNumber()
  longitude: number | string;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 39.908708))
  @IsNumber()
  latitude: number | string;

  @ApiProperty({
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  radius: number | string;
}
