import { Test, TestingModule } from '@nestjs/testing';
import { NeedsControllerClient } from './needs.controller.client';
import { NeedsService } from './needs.service';

describe('NeedsControllerClient', () => {
  let controller: NeedsControllerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeedsControllerClient],
      providers: [NeedsService],
    }).compile();

    controller = module.get<NeedsControllerClient>(NeedsControllerClient);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
