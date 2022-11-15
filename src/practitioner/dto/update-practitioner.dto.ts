import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreatePractitionerDto } from './create-practitioner.dto';

export class UpdatePractitionerDto extends PartialType(CreatePractitionerDto) {
  @ApiPropertyOptional()
  qualificationsAccepted?: boolean;
  @ApiPropertyOptional()
  $inc?: { [key: string]: number };
  @ApiPropertyOptional()
  $min?: { [key: string]: number };
  @ApiPropertyOptional()
  $max?: { [key: string]: number };
  @ApiPropertyOptional()
  $mul?: { [key: string]: number };
  @ApiPropertyOptional()
  $rename?: Record<string, string>;
  @ApiPropertyOptional()
  $set?: { [key: string]: any };
  @ApiPropertyOptional()
  $setOnInsert?: { [key: string]: any };
  @ApiPropertyOptional()
  $unset?: { [key: string]: any };
  @ApiPropertyOptional()
  $addToSet?: { [key: string]: any };
  @ApiPropertyOptional()
  $pop?: { [key: string]: number };
  @ApiPropertyOptional()
  $pull?: { [key: string]: any };
  @ApiPropertyOptional()
  $pullAll?: { [key: string]: any[] };
  @ApiPropertyOptional()
  $push?: { [key: string]: any };
}
