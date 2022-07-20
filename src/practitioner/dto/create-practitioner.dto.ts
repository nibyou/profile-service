import { ApiProperty } from '@nestjs/swagger';
import { Qualification } from '../schemata/practitioner.schema';

export class CreatePractitionerDto {
  @ApiProperty()
  acceptedTerms: boolean;

  @ApiProperty()
  salutation: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  profileImage: string;

  @ApiProperty({ type: () => [Qualification] })
  careerPath: Qualification[];

  @ApiProperty({ type: [String] })
  practices: string[];
}
