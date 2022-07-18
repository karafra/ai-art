import { Test, TestingModule } from '@nestjs/testing';
import { HelpService } from './help.service';

describe('HelpService', () => {
  let service: HelpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpService],
    }).compile();

    service = module.get<HelpService>(HelpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
