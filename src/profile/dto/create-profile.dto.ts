import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';

export class CreateProfileDto {
  @ApiProperty()
  salutation: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @Prop()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  sex: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  healthInsuranceNumber: string;

  @ApiProperty()
  healthInsuranceInstitute: string;

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

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  acceptedTerms: boolean;

  @ApiProperty()
  profileImage: string;
}
