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
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { RolesGuard } from '../roles/roles.guard';

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
  ): Promise<InfinityPaginationResponseDto<Hospital>> {
    const { page = 1, limit = 10 } = query;

    return infinityPagination(
      await this.hospitalsService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findWithCircle(@Query() query: QueryHospitalDto): Promise<Hospital[]> {
    return this.hospitalsService.findManyWithCircle({ circleOptions: query });
  }
}
