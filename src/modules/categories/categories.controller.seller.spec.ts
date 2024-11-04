import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesControllerSeller } from './categories.controller.seller';
import { CategoriesService } from './categories.service';

describe('CategoriesControllerSeller', () => {
  let controller: CategoriesControllerSeller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesControllerSeller],
      providers: [CategoriesService],
    }).compile();

    controller = module.get<CategoriesControllerSeller>(CategoriesControllerSeller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
