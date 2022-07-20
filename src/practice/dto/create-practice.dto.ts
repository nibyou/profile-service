import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePracticeDto {
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

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  mobileNumber?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  admins?: string[];
}
