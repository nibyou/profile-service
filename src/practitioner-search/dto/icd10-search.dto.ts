import { ApiProperty } from '@nestjs/swagger';

export class ICD10Item {
  @ApiProperty()
  code: string;
  @ApiProperty()
  name: string;
}

export class ICD10SearchResult {
  @ApiProperty({
    type: () => ICD10Item,
  })
  item: ICD10Item;
  @ApiProperty()
  refIndex: number;
  @ApiProperty()
  score: number;
}

export class Icd10SearchDto {
  @ApiProperty({
    type: () => [ICD10SearchResult],
  })
  results: ICD10SearchResult[];
}

export class GetIcd10SearchResultDto {
  @ApiProperty()
  search: string;
  @ApiProperty()
  limit: number;
}
