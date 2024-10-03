import { Test, TestingModule } from '@nestjs/testing';
import { ShopsRepo } from './shops.repo';

describe('ShopsRepo', () => {
  let service: ShopsRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopsRepo],
    }).compile();

    service = module.get<ShopsRepo>(ShopsRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
