import { Test, TestingModule } from '@nestjs/testing';
import { AdminsCategoriesController } from './categories.controller.admin';
import { CategoriesService } from './categories.service';

describe('AdminsCategoriesController', () => {
  let controller: AdminsCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsCategoriesController],
      providers: [CategoriesService],
    }).compile();

    controller = module.get<AdminsCategoriesController>(AdminsCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
