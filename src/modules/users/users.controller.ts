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
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../shared/roles/roles.decorator';
import { RoleEnum } from '../../shared/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../../shared/utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../../shared/utils/types/nullable.type';
import { QueryUserDto } from './dto/query-user.dto';
import { User } from './domain/user';
import { UsersService } from './users.service';
import { RolesGuard } from '../../shared/roles/roles.guard';
import { infinityPagination } from '../../shared/utils/infinity-pagination';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // #region
  @ApiCreatedResponse({
    type: User,
  })
  // #endregion
  @Post()
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createProfileDto);
  }

  // #region
  @ApiOkResponse({
    type: InfinityPaginationResponse(User),
  })
  // #endregion
  @Get()
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.usersService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
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
    type: User,
  })
  // #endregion
  @Get(':id')
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }

  // #region
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: User,
  })
  // #endregion
  @Patch(':id')
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersService.update(id, updateProfileDto);
  }

  // #region
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  // #endregion
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.usersService.remove(id);
  }
}
