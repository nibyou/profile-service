import { applyDecorators } from '@nestjs/common';
import { RealmRoles } from '@nibyou/types';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public, Roles } from 'nest-keycloak-connect';

export function AuthOperation(
  rolesOrPublic: RealmRoles[] | 'public',
  summary: string,
  operationId?: string,
) {
  return applyDecorators(
    ApiOperation({ summary, operationId }),
    rolesOrPublic === 'public' ? Public() : Roles({ roles: rolesOrPublic }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.' }),
    ApiForbiddenResponse({ description: 'Forbidden.' }),
  );
}
