import { Test, TestingModule } from '@nestjs/testing';
import { ShopsControllerSeller } from './shops.controller.seller';
import { ShopsService } from './shops.service';

describe('ShopsControllerSeller', () => {
  let controller: ShopsControllerSeller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopsControllerSeller],
      providers: [ShopsService],
    }).compile();

    controller = module.get<ShopsControllerSeller>(ShopsControllerSeller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
