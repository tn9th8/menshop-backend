import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Metadata } from 'src/common/interfaces/response.interface';
import { UpdateUserKeyDto } from './dto/update-user-keys.dto';
import { UserKeysRepository } from './user-keys.repository';
import { UserKeyDoc } from './schemas/user-keys.schema';
import { IKey } from 'src/common/interfaces/index.interface';
import { notFoundIdMessage } from 'src/common/utils/exception.util';

@Injectable()
export class UserKeysService {
  constructor(private readonly userKeysRepo: UserKeysRepository) { }

  //CREATE//
  async createOne({ userId = null, verifyToken = null }): Promise<UserKeyDoc> {
    //todo: transform
    try {
      const payload = { userId, verifyToken };
      const created = await this.userKeysRepo.createOne(payload);
      return created;
    } catch (error) {
      throw error;
    }
  }

  async createKeyForUser({ userId, verifyToken = null }): Promise<UserKeyDoc> {
    try {
      const payload = { userId, verifyToken };
      const created = await this.userKeysRepo.createOne(payload);
      return created;
    } catch (error) {
      throw new BadRequestException("Có lỗi khi tạo một userKey");
    }
  }

  //UPDATE//
  async updateRefreshToken({ userId = null, refreshToken = null }): Promise<Metadata> {
    const meta = await this.userKeysRepo.updateByIdGetMeta(userId, { refreshToken });
    return meta;
  }

  //QUERY//
  findAll() {
    return `This action returns all userKey`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userKey`;
  }

  update(id: number, updateUserKeyDto: UpdateUserKeyDto) {
    return `This action updates a #${id} userKey`;
  }

  remove(id: number) {
    return `This action removes a #${id} userKey`;
  }
}
