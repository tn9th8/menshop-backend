import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsRepository } from './discounts.repository';

describe('DiscountsRepository', () => {
  let service: DiscountsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountsRepository],
    }).compile();

    service = module.get<DiscountsRepository>(DiscountsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
