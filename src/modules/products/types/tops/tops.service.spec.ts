import { Test, TestingModule } from '@nestjs/testing';
import { TopsService } from './tops.service';

describe('TopsService', () => {
  let service: TopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopsService],
    }).compile();

    service = module.get<TopsService>(TopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
