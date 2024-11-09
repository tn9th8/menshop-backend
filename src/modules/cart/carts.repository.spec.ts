import { Test, TestingModule } from '@nestjs/testing';
import { CartsRepository } from './carts.service';

describe('CartsRepository', () => {
  let service: CartsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsRepository],
    }).compile();

    service = module.get<CartsRepository>(CartsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
