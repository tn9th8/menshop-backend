import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesControllerAdmin } from './categories.controller.admin';
import { CategoriesService } from './categories.service';

describe('CategoriesControllerAdmin', () => {
  let controller: CategoriesControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesControllerAdmin],
      providers: [CategoriesService],
    }).compile();

    controller = module.get<CategoriesControllerAdmin>(CategoriesControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
