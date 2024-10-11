import { Test, TestingModule } from '@nestjs/testing';
import { ClientsCategoriesController } from './categories.controller.client';
import { CategoriesService } from './categories.service';

describe('ClientsCategoriesController', () => {
  let controller: ClientsCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsCategoriesController],
      providers: [CategoriesService],
    }).compile();

    controller = module.get<ClientsCategoriesController>(ClientsCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
