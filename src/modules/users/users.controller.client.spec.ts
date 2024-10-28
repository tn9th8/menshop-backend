import { Test, TestingModule } from '@nestjs/testing';
import { UsersControllerClient } from './users.controller.client';


describe('UsersControllerClient', () => {
  let controller: UsersControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersControllerClient],
    }).compile();

    controller = module.get<UsersControllerClient>(UsersControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
