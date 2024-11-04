import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesControllerClient } from './categories.controller.client';
import { CategoriesService } from './categories.service';

describe('CategoriesControllerClient', () => {
  let controller: CategoriesControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesControllerClient],
      providers: [CategoriesService],
    }).compile();

    controller = module.get<CategoriesControllerClient>(CategoriesControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
