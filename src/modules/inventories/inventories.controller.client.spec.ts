import { Test, TestingModule } from '@nestjs/testing';
import { InventoriesControllerClient } from './inventories.controller.client';
import { InventoriesService } from './inventories.service';

describe('InventoriesControllerClient', () => {
  let controller: InventoriesControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoriesControllerClient],
      providers: [InventoriesService],
    }).compile();

    controller = module.get<InventoriesControllerClient>(InventoriesControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
