import { Test, TestingModule } from '@nestjs/testing';
import { PractitionerSearchController } from './practitioner-search.controller';
import { PractitionerSearchService } from './practitioner-search.service';

describe('PractitionerSearchController', () => {
  let controller: PractitionerSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PractitionerSearchController],
      providers: [PractitionerSearchService],
    }).compile();

    controller = module.get<PractitionerSearchController>(
      PractitionerSearchController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
