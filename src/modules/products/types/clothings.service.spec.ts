import { Test, TestingModule } from '@nestjs/testing';
import { ClothingsService } from './clothings.service';

describe('ClothingsService', () => {
  let service: ClothingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClothingsService],
    }).compile();

    service = module.get<ClothingsService>(ClothingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
