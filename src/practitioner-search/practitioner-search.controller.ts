import { Controller } from '@nestjs/common';
import { PractitionerSearchService } from './practitioner-search.service';

@Controller('practitioner-search')
export class PractitionerSearchController {
  constructor(
    private readonly practitionerSearchService: PractitionerSearchService,
  ) {}
}
