import { Test, TestingModule } from '@nestjs/testing';
import { ShopsRepository } from './shops.repository';

describe('ShopsRepository', () => {
  let service: ShopsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopsRepository],
    }).compile();

    service = module.get<ShopsRepository>(ShopsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
