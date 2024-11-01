import { Test, TestingModule } from '@nestjs/testing';
import { InventoriesRepository } from './inventories.repository';

describe('InventoriesRepository', () => {
  let repository: InventoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoriesRepository],
    }).compile();

    repository = module.get<InventoriesRepository>(InventoriesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
