import { Test, TestingModule } from '@nestjs/testing';
import { UserKeysRepository } from './user-keys.repository';

describe('UserKeysRepository', () => {
  let service: UserKeysRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserKeysRepository],
    }).compile();

    service = module.get<UserKeysRepository>(UserKeysRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
