import { Test, TestingModule } from '@nestjs/testing';
import { AuthControllerClient } from './auth.controller.client';

describe('AuthControllerClient', () => {
  let controller: AuthControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthControllerClient],
    }).compile();

    controller = module.get<AuthControllerClient>(AuthControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
