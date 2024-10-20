import { Test, TestingModule } from '@nestjs/testing';
import { NeedsRepository } from './needs.repository';

describe('NeedsRepository', () => {
  let service: NeedsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NeedsRepository],
    }).compile();

    service = module.get<NeedsRepository>(NeedsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
