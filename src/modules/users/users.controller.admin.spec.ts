import { Test, TestingModule } from '@nestjs/testing';
import { UsersControllerAdmin } from './users.controller.admin';
import { UsersService } from './users.service';

describe('UsersControllerAdmin', () => {
  let controller: UsersControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersControllerAdmin],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersControllerAdmin>(UsersControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
