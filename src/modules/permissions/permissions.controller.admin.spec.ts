import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsControllerAdmin } from './permissions.controller.admin';
import { PermissionsService } from './permissions.service';

describe('PermissionsControllerAdmin', () => {
  let controller: PermissionsControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsControllerAdmin],
      providers: [PermissionsService],
    }).compile();

    controller = module.get<PermissionsControllerAdmin>(PermissionsControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
