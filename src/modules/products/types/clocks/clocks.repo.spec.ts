import { Test, TestingModule } from '@nestjs/testing';
import { ClocksRepo } from './clocks.repo';

describe('ClocksRepo', () => {
  let service: ClocksRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClocksRepo],
    }).compile();

    service = module.get<ClocksRepo>(ClocksRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
