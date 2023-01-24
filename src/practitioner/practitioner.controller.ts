import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { CreatePractitionerDto } from './dto/create-practitioner.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Practitioner } from './schemata/practitioner.schema';
import { Roles } from 'nest-keycloak-connect';
import { RealmRoles } from '@nibyou/types';
import { UpdatePractitionerDto } from './dto/update-practitioner.dto';

@ApiBearerAuth()
@ApiTags('practitioners')
@Controller('practitioners')
export class PractitionerController {
  constructor(private readonly practitionerService: PractitionerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new practitioner' })
  @ApiCreatedResponse({
    description: 'The practitioner has been successfully created.',
    type: Practitioner,
  })
  @Roles({
    roles: [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PRACTITIONER_PENDING,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  create(@Body() createPractitionerDto: CreatePractitionerDto) {
    return this.practitionerService.create(createPractitionerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all practitioners' })
  @ApiOkResponse({
    description: 'The practitioners have been successfully returned.',
    type: [Practitioner],
  })
  @Roles({ roles: [RealmRoles.ADMIN] })
  findAll() {
    return this.practitionerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a practitioner' })
  @ApiOkResponse({
    description: 'The practitioner has been successfully returned.',
    type: Practitioner,
  })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.USER_PATIENT,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.BACKEND_SERVICE,
    ],
  })
  findOne(@Param('id') id: string) {
    return this.practitionerService.findOne(id);
  }

  @Get('/byPractice/:practiceId')
  @ApiOperation({ summary: 'Get all practitioners by practice' })
  @ApiOkResponse({
    description: 'The practitioners have been successfully returned.',
  })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
    ],
  })
  findByPractice(@Param('practiceId') practiceId: string) {
    return this.practitionerService.findByPractice(practiceId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a practitioner' })
  @ApiOkResponse({
    description: 'The practitioner has been successfully updated.',
    type: Practitioner,
  })
  @Roles({ roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER] })
  update(
    @Param('id') id: string,
    @Body() updatePractitionerDto: UpdatePractitionerDto,
  ) {
    return this.practitionerService.update(id, updatePractitionerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a practitioner' })
  @ApiNoContentResponse({
    description: 'The practitioner has been successfully deleted.',
  })
  @Roles({ roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER] })
  remove(@Param('id') id: string) {
    return this.practitionerService.remove(id);
  }
}
