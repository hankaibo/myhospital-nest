import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { QueryHospitalDto } from './dto/query-hospital.dto';
import { Hospital } from './domain/hospital';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { PaginationResponseDto } from '../utils/dto/pagination-response.dto';
import { RolesGuard } from '../roles/roles.guard';
import { pagination } from '../utils/pagination';

@ApiBearerAuth()
@ApiTags('Hospitals')
@Controller({
  path: 'hospitals',
  version: '1',
})
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @ApiOkResponse({
    type: InfinityPaginationResponse(Hospital),
  })
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryHospitalDto,
  ): Promise<PaginationResponseDto<Hospital>> {
    const { page = 1, limit = 10 } = query;

    const [data, total] = await this.hospitalsService.findManyWithPagination({
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });
    return pagination(data, { page, limit }, total);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findWithCircle(@Query() query: QueryHospitalDto): Promise<Hospital[]> {
    return this.hospitalsService.findManyWithCircle({ circleOptions: query });
  }
}
