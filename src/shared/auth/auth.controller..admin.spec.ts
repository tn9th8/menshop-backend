import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthControllerAdmin } from './auth.controller.admin';

describe('AuthControllerAdmin', () => {
  let controller: AuthControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthControllerAdmin],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthControllerAdmin>(AuthControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
