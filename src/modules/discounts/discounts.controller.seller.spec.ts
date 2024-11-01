import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsControllerSeller } from './discounts.controller.seller';
import { DiscountsService } from './discounts.service';

describe('DiscountsControllerSeller', () => {
  let controller: DiscountsControllerSeller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountsControllerSeller],
      providers: [DiscountsService],
    }).compile();

    controller = module.get<DiscountsControllerSeller>(DiscountsControllerSeller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
