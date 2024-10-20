import { Test, TestingModule } from '@nestjs/testing';
import { NeedsControllerAdmin } from './needs.controller.admin';
import { NeedsService } from './needs.service';

describe('NeedsControllerAdmin', () => {
  let controller: NeedsControllerAdmin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeedsControllerAdmin],
      providers: [NeedsService],
    }).compile();

    controller = module.get<NeedsControllerAdmin>(NeedsControllerAdmin);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
