import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Hospital } from './domain/hospital';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import {
  PaginationResponse,
  PaginationResponseDto,
} from '../utils/dto/pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { pagination } from '../utils/pagination';
import {
  QueryHospitalsDto,
  FilterHospitalDto,
} from './dto/find-all-hospitals.dto';

@ApiTags('Hospitals')
@Controller({
  path: 'hospitals',
  version: '1',
})
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get('circle')
  @HttpCode(HttpStatus.OK)
  findWithCircle(@Query() query: FilterHospitalDto): Promise<Hospital[]> {
    const longitude = query.longitude;
    const latitude = query.latitude;
    let radius = query.radius;

    if (radius > 1000) {
      radius = 1000;
    }

    return this.hospitalsService.findByCircle({
      circleOptions: {
        longitude,
        latitude,
        radius,
      },
    });
  }

  // #region
  @ApiCreatedResponse({
    type: Hospital,
  })
  @ApiBearerAuth()
  // #endregion
  @Post()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  // #region
  @ApiOkResponse({
    type: PaginationResponse(Hospital),
  })
  @ApiBearerAuth()
  // #endregion
  @Get('pagination')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async find(
    @Query() query: QueryHospitalsDto,
  ): Promise<PaginationResponseDto<Hospital>> {
    const { page = 1, limit = 10 } = query;

    const [data, total] =
      await this.hospitalsService.findAllAndCountWithPagination({
        sortOptions: query?.sort,
        filterOptions: query?.filters,
        paginationOptions: {
          page,
          limit,
        },
      });
    return pagination(data, { page, limit }, total);
  }

  // #region
  @ApiOkResponse({
    type: InfinityPaginationResponse(Hospital),
  })
  @ApiBearerAuth()
  // #endregion
  @Get()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryHospitalsDto,
  ): Promise<InfinityPaginationResponseDto<Hospital>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 100) {
      limit = 100;
    }

    return infinityPagination(
      await this.hospitalsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  // #region
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Hospital,
  })
  @ApiBearerAuth()
  // #endregion
  @Get(':id')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findById(@Param('id') id: string) {
    return this.hospitalsService.findById(id);
  }

  // #region
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Hospital,
  })
  @ApiBearerAuth()
  // #endregion
  @Patch(':id')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ) {
    return this.hospitalsService.update(id, updateHospitalDto);
  }

  // #region
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiBearerAuth()
  // #endregion
  @Delete(':id')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.hospitalsService.remove(id);
  }

  // #region
  @ApiCreatedResponse({
    type: Hospital,
  })
  @ApiBearerAuth()
  // #endregion
  @Post(':id/copy')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  copy(@Param('id') id: Hospital['id']): Promise<Hospital> {
    return this.hospitalsService.copy(id);
  }

  // #region
  @ApiBearerAuth()
  // #endregion
  @Post('copy')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  copyAll(): Promise<void> {
    return this.hospitalsService.copyAll('；');
  }

  // #region
  @ApiCreatedResponse({
    type: Hospital,
  })
  @ApiBearerAuth()
  // #endregion
  @Get('sync/:name')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  sync(@Param('name') name: string): Promise<void> {
    return this.hospitalsService.sync(name);
  }
}
