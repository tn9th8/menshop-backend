import { Test, TestingModule } from '@nestjs/testing';
import { ShopsControllerAdmin } from './shops.controller.admin';
import { ShopsService } from './shops.service';

describe('ShopsControllerAdmin', () => {
  let controller: ShopsControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopsControllerAdmin],
      providers: [ShopsService],
    }).compile();

    controller = module.get<ShopsControllerAdmin>(ShopsControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
