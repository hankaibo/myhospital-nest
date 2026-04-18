import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class SyncStagingHospitalsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  batchId?: string;

  @ApiPropertyOptional({ default: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5000)
  limit?: number = 500;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  retryFailed?: boolean = false;

  @ApiPropertyOptional({
    description:
      '省份前缀（如 "13"），用于同步后标记该省份中不在 staging 的医院为已删除',
  })
  @IsOptional()
  @IsString()
  regionCode?: string;

  @ApiPropertyOptional({ default: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(5000)
  chunkSize?: number = 1000;
}
