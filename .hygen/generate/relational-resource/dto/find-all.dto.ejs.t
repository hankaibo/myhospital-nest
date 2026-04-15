---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/dto/find-all-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.dto.ts
---
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Filter<%= name %>Dto } from './filter-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Sort<%= name %>Dto } from './sort-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';

export class FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto {
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

  @ApiPropertyOptional({ type: Filter<%= name %>Dto })
  @ValidateNested()
  @IsOptional()
  @Type(() => Filter<%= name %>Dto)
  filters?: Filter<%= name %>Dto;

  @ApiPropertyOptional({ type: Sort<%= name %>Dto })
  @ValidateNested()
  @IsOptional()
  @Type(() => Sort<%= name %>Dto)
  sort?: Sort<%= name %>Dto;
}
