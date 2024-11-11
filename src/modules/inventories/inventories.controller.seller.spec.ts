import { Test, TestingModule } from '@nestjs/testing';
import { InventoriesControllerSeller } from './inventories.controller.seller';
import { InventoriesService } from './inventories.service';

describe('InventoriesControllerSeller', () => {
  let controller: InventoriesControllerSeller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoriesControllerSeller],
      providers: [InventoriesService],
    }).compile();

    controller = module.get<InventoriesControllerSeller>(InventoriesControllerSeller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
