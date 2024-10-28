import { Test, TestingModule } from '@nestjs/testing';
import { KeyStoreRepository } from './key-store.repository';

describe('KeyStoreRepository', () => {
  let service: KeyStoreRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyStoreRepository],
    }).compile();

    service = module.get<KeyStoreRepository>(KeyStoreRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
