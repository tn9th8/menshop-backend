import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsControllerAdmin } from './discounts.controller.admin';
import { DiscountsService } from './discounts.service';

describe('DiscountsControllerAdmin', () => {
  let controller: DiscountsControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountsControllerAdmin],
      providers: [DiscountsService],
    }).compile();

    controller = module.get<DiscountsControllerAdmin>(DiscountsControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
