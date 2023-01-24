import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Profile } from './schemata/profile.schema';
import { Roles } from 'nest-keycloak-connect';
import { RealmRoles } from '@nibyou/types';

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new patient profile',
  })
  @ApiCreatedResponse({
    description: 'The patient profile has been successfully created.',
    type: Profile,
  })
  @Roles({
    roles: [
      RealmRoles.USER_PATIENT,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.BACKEND_SERVICE,
      RealmRoles.ADMIN,
    ],
  })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patient profiles' })
  @ApiOkResponse({
    description: 'The patient profiles have been successfully returned.',
    type: [Profile],
  })
  @Roles({ roles: [RealmRoles.ADMIN] })
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient profile' })
  @ApiOkResponse({
    description: 'The patient profile has been successfully returned.',
    type: Profile,
  })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
      RealmRoles.BACKEND_SERVICE,
    ],
  })
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient profile' })
  @ApiOkResponse({
    description: 'The patient profile has been successfully updated.',
    type: Profile,
  })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
    ],
  })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient profile' })
  @ApiNoContentResponse({
    description: 'The patient profile has been successfully deleted.',
  })
  @Roles({
    roles: [
      RealmRoles.ADMIN,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.USER_PATIENT,
    ],
  })
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
