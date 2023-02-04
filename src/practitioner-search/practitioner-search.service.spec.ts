import { Test, TestingModule } from '@nestjs/testing';
import { PractitionerSearchService } from './practitioner-search.service';

describe('PractitionerSearchService', () => {
  let service: PractitionerSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PractitionerSearchService],
    }).compile();

    service = module.get<PractitionerSearchService>(PractitionerSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
