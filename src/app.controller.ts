import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { AppService, S3UrlResponse } from './app.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JsonResponse, RealmRoles } from '@nibyou/types';
import { Public, Roles } from 'nest-keycloak-connect';

@Controller()
@ApiBearerAuth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOkResponse({
    status: 200,
    description: 'API health check',
    type: JsonResponse,
  })
  @HttpCode(200)
  @Public()
  getHealth(): JsonResponse {
    return this.appService.getHealth();
  }

  @Get('/presigned-s3-url')
  @ApiOperation({
    summary: 'Get a presigned URL for the file upload',
  })
  @ApiOkResponse({
    description: 'The presigned URL has been successfully returned.',
    type: S3UrlResponse,
  })
  @Roles({
    roles: [
      RealmRoles.USER_PATIENT,
      RealmRoles.USER_PRACTITIONER,
      RealmRoles.ADMIN,
    ],
  })
  createPresignedImageUrl(
    @Query('ext') ext: string,
    @Query('bucket') bucket: string,
  ): Promise<S3UrlResponse> {
    return this.appService.createPresignedImageUrl(ext, bucket);
  }
}
