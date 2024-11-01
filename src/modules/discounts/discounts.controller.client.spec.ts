import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsControllerClient } from './discounts.controller.client';
import { DiscountsService } from './discounts.service';

describe('DiscountsControllerClient', () => {
  let controller: DiscountsControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountsControllerClient],
      providers: [DiscountsService],
    }).compile();

    controller = module.get<DiscountsControllerClient>(DiscountsControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
