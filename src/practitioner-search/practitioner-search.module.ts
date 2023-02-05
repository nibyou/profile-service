import { Module } from '@nestjs/common';
import { PractitionerSearchService } from './practitioner-search.service';
import { PractitionerSearchController } from './practitioner-search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PracticeSchema } from '../practice/schemata/practice.schema';

@Module({
  controllers: [PractitionerSearchController],
  providers: [PractitionerSearchService],
  imports: [
    MongooseModule.forFeature([{ name: 'Practice', schema: PracticeSchema }]),
  ],
})
export class PractitionerSearchModule {}
