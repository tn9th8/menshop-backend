import { Injectable, NotFoundException } from '@nestjs/common';
import { Metadata } from 'src/common/interfaces/response.interface';
import { UpdateKeyStoreDto } from './dto/update-key-store.dto';
import { KeyStoreRepository } from './key-store.repository';
import { IKeyStore } from './schemas/key-store.schema';
import { IKey } from 'src/common/interfaces/index.interface';
import { notFoundIdMessage } from 'src/common/utils/exception.util';

@Injectable()
export class KeyStoreService {
  constructor(private readonly keyStoreRepo: KeyStoreRepository) { }

  //CREATE//
  async createOne({ userId = null, verifyToken = null }): Promise<IKeyStore> {
    //todo: transform
    try {
      const payload = { userId, verifyToken };
      const created = await this.keyStoreRepo.createOne(payload);
      return created;
    } catch (error) {
      throw error;
    }
  }

  //UPDATE//
  async updateRefreshToken({ userId = null, refreshToken = null }): Promise<Metadata> {
    //todo: transform
    const payload = { refreshToken }
    const meta = await this.keyStoreRepo.updateByIdGetMeta(userId, payload);
    return meta;
  }

  //QUERY//
  findAll() {
    return `This action returns all keyStore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} keyStore`;
  }

  update(id: number, updateKeyStoreDto: UpdateKeyStoreDto) {
    return `This action updates a #${id} keyStore`;
  }

  remove(id: number) {
    return `This action removes a #${id} keyStore`;
  }
}
