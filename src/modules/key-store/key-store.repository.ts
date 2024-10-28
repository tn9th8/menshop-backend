import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IKey } from 'src/common/interfaces/index.interface';
import { Metadata } from 'src/common/interfaces/response.interface';
import { UpdateKeyStoreDto } from './dto/update-key-store.dto';
import { IKeyStore, KeyStore } from './schemas/key-store.schema';
import { toDbSelect } from 'src/common/utils/mongo.util';

@Injectable()
export class KeyStoreRepository {
  constructor(
    @InjectModel(KeyStore.name)
    private readonly keyStoreModel: SoftDeleteModel<IKeyStore>
  ) { }

  //CREATE//
  async createOne({ userId, verifyToken }) {
    const payload = { user: userId, verifyToken }
    const created = await this.keyStoreModel.create(payload);
    return (created as any)._doc;
  }

  //UPDATE//
  async updateByIdGetMeta(
    userId: IKey,
    payload: any,
    isNew: boolean = true
  ): Promise<Metadata> {
    const dbOptions = { new: isNew };
    const dbQuery = { user: userId };
    const dbPayload = { $push: { refreshToken: payload.refreshToken } };
    const updated = await this.keyStoreModel.findOneAndUpdate(dbQuery, dbPayload, dbOptions);
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  // async updateVerifyTokenById(
  //   userId: IKey,
  //   payload: any,
  //   isNew: boolean = true
  // ): Promise<Metadata> {
  //   const dbOptions = { new: isNew };
  //   const dbQuery = { user: userId };
  //   const updated = await this.keyStoreModel.findOneAndUpdate(dbQuery, payload, dbOptions);
  //   return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  // }

  //QUERY//
  async findLeanByQuery(
    userId: IKey,
    select: string[]
  ): Promise<IKeyStore | null> {
    return await this.keyStoreModel.findOne({ user: userId })
      .select(toDbSelect(select));
  }

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
