import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePracticeDto } from './create-practice.dto';

export class UpdatePracticeDto extends PartialType(CreatePracticeDto) {}

export class UpdatePracticeEmailDto {
  @ApiProperty()
  email: string;
}

export class UpdatePracticeAddressDto {
  @ApiProperty()
  street: string;

  @ApiProperty()
  houseNumber: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiPropertyOptional()
  phoneNumber?: string;
}

export class UpdatePracticeNameDto {
  @ApiProperty()
  name: string;
}

export class UpdatePracticeLogoDto {
  @ApiProperty()
  logo: string;
}

export class UpdatePracticeWebsiteDto {
  @ApiProperty()
  website: string;
}

export class UpdatePracticeMobileNumberDto {
  @ApiProperty()
  mobileNumber: string;
}

export class UpdatePracticeAddAdminDto {
  @ApiProperty()
  admin: string;
}

export class UpdatePracticeRemoveAdminDto extends UpdatePracticeAddAdminDto {}
