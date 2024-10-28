import { Test, TestingModule } from '@nestjs/testing';
import { KeyStoreService } from './key-store.service';

describe('KeyStoreService', () => {
  let service: KeyStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyStoreService],
    }).compile();

    service = module.get<KeyStoreService>(KeyStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
