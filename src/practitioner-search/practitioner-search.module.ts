import { Module } from '@nestjs/common';
import { PractitionerSearchService } from './practitioner-search.service';
import { PractitionerSearchController } from './practitioner-search.controller';

@Module({
  controllers: [PractitionerSearchController],
  providers: [PractitionerSearchService],
})
export class PractitionerSearchModule {}
