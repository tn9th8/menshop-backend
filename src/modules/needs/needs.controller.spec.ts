import { Test, TestingModule } from '@nestjs/testing';
import { NeedsController } from './needs.controller';
import { NeedsService } from './needs.service';

describe('NeedsController', () => {
  let controller: NeedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeedsController],
      providers: [NeedsService],
    }).compile();

    controller = module.get<NeedsController>(NeedsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
