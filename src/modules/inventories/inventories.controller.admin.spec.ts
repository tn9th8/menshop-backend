import { Test, TestingModule } from '@nestjs/testing';
import { InventoriesControllerAdmin } from './inventories.controller.admin';
import { InventoriesService } from './inventories.service';

describe('InventoriesControllerAdmin', () => {
  let controller: InventoriesControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoriesControllerAdmin],
      providers: [InventoriesService],
    }).compile();

    controller = module.get<InventoriesControllerAdmin>(InventoriesControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
