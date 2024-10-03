import { Test, TestingModule } from '@nestjs/testing';
import { TypesRepo } from './types.repo';

describe('TypesRepo', () => {
  let service: TypesRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesRepo],
    }).compile();

    service = module.get<TypesRepo>(TypesRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
