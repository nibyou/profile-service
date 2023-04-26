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
import {
  AddRatingDto,
  UpdatePracticeAddAdminDto,
  UpdatePracticeAddMarketingInformationDto,
  UpdatePracticeAddressDto,
  UpdatePracticeDto,
  UpdatePracticeEmailDto,
  UpdatePracticeLogoDto,
  UpdatePracticeMobileNumberDto,
  UpdatePracticeNameDto,
  UpdatePracticeRemoveAdminDto,
  UpdatePracticeWebsiteDto,
} from './dto/update-practice.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Practice } from './schemata/practice.schema';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import {
  AuthUser,
  CreateRequest,
  DeleteRequest,
  RealmRoles,
  UpdateRequest,
} from '@nibyou/types';
import { AuthOperation } from '../operation.decorator';

@ApiTags('practices')
@ApiBearerAuth()
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  @AuthOperation(
    [
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.ADMIN,
      RealmRoles.USER_PRACTITIONER_PENDING,
    ],
    'Create new Practice',
    'createPractice',
  )
  @ApiCreatedResponse({
    description: 'The practice has been successfully created.',
    type: Practice,
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
    type: [Practice],
  })
  @Roles({ roles: [RealmRoles.ADMIN] })
  findAll() {
    return this.practiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a practice' })
  @ApiOkResponse({
    description: 'The practice has been successfully returned.',
    type: Practice,
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
    type: Practice,
  })
  @Roles({ roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER] })
  update(
    @Param('id') id: string,
    @Body() updatePracticeDto: UpdatePracticeDto,
  ) {
    return this.practiceService.update(id, updatePracticeDto);
  }

  @UpdateRequest({
    description: 'Updated the practices contact email',
    path: ':id/email',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Update the practices contact email',
  })
  updateEmail(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeEmailDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.updateEmail(id, dto, user);
  }

  @UpdateRequest({
    description: 'Updated the practices address',
    path: ':id/address',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Update the practices contact address',
  })
  updateAddress(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeAddressDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.updateAddress(id, dto, user);
  }

  @UpdateRequest({
    description: 'Updated the practices name',
    path: ':id/name',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Update the practices name',
  })
  updateName(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeNameDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.updateName(id, dto, user);
  }

  @UpdateRequest({
    description: 'Updated the practices Website',
    path: ':id/website',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Update the practices Website',
  })
  updateWebsite(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeWebsiteDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.updateWebsite(id, dto, user);
  }

  @UpdateRequest({
    description: 'Updated the practices contact mobile number',
    path: ':id/mobile-number',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Update the practices contact mobile number',
  })
  updateMobileNumber(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeMobileNumberDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.updateMobileNumber(id, dto, user);
  }

  @CreateRequest({
    description: 'Added a new Admin to the practice',
    path: ':id/admin',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Add a new Admin to the practice',
  })
  addAdmin(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeAddAdminDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.addAdmin(id, dto, user);
  }

  @DeleteRequest({
    description: 'Removed an Admin from the practice',
    path: ':id/admin',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Remove an Admin from the practice',
  })
  removeAdmin(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeRemoveAdminDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.removeAdmin(id, dto, user);
  }

  @UpdateRequest({
    description: 'Updated the practices logo',
    path: ':id/logo',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Update the practices logo',
  })
  updateLogo(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeLogoDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.updateLogo(id, dto, user);
  }

  @UpdateRequest({
    description: 'Add Marketing Information to practice',
    path: ':id/marketing',
    returnType: Practice,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PRACTITIONER],
    summary: 'Add Marketing Information',
  })
  addMarketing(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeAddMarketingInformationDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.addMarketing(id, dto, user);
  }

  @CreateRequest({
    description: 'Add a new Rating to a practice',
    path: ':id/rating',
    returnType: Number,
    roles: [RealmRoles.ADMIN, RealmRoles.USER_PATIENT],
    summary: 'Add a new Rating',
  })
  async addRating(
    @Param('id') id: string,
    @Body() dto: AddRatingDto,
    @AuthenticatedUser() user: AuthUser,
  ) {
    return this.practiceService.addRating(id, dto, user);
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
