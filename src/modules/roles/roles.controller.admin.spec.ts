import { Test, TestingModule } from '@nestjs/testing';
import { RolesControllerAdmin } from './roles.controller.admin';
import { RolesService } from './roles.service';

describe('RolesControllerAdmin', () => {
  let controller: RolesControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesControllerAdmin],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesControllerAdmin>(RolesControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
