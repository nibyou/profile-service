import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';
import { GlobalStatus } from '@nibyou/types';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty()
  status: GlobalStatus;
}
