import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PracticeService } from './practice.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Practice } from './schemata/practice.schema';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { AuthUser, RealmRoles } from '@nibyou/types';

@ApiTags('practices')
@ApiBearerAuth()
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new practice' })
  @ApiCreatedResponse({
    description: 'The practice has been successfully created.',
    type: Practice,
  })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  create(
    @Body() createPracticeDto: CreatePracticeDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.create(createPracticeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all practices' })
  @ApiOkResponse({
    description: 'The practices have been successfully returned.',
  })
  @Roles({ roles: [RealmRoles.ADMIN] })
  findAll() {
    return this.practiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a practice' })
  @ApiOkResponse({
    description: 'The practice has been successfully returned.',
  })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.USER_PATIENT,
      RealmRoles.USER_PRACTITIONER,
    ],
  })
  findOne(@Param('id') id: string) {
    return this.practiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a practice' })
  @ApiOkResponse({
    description: 'The practice has been successfully updated.',
  })
  @Roles({ roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER] })
  update(
    @Param('id') id: string,
    @Body() updatePracticeDto: UpdatePracticeDto,
  ) {
    return this.practiceService.update(id, updatePracticeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a practice' })
  @ApiOkResponse({
    description: 'The practice has been successfully deleted.',
  })
  @Roles({ roles: [RealmRoles.ADMIN] })
  remove(@Param('id') id: string) {
    return this.practiceService.remove(id);
  }
}
