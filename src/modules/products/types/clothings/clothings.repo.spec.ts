import { Test, TestingModule } from '@nestjs/testing';
import { ClothingsRepo } from './clothings.repo';

describe('ClothingsRepo', () => {
  let service: ClothingsRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClothingsRepo],
    }).compile();

    service = module.get<ClothingsRepo>(ClothingsRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
