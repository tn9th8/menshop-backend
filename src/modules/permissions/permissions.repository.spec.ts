import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsRepository } from './permissions.repository';

describe('PermissionsRepository', () => {
  let service: PermissionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsRepository],
    }).compile();

    service = module.get<PermissionsRepository>(PermissionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
