import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Moment } from 'moment';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SignUpClientDto } from 'src/auth/dto/signup-client.dto';
import { ICreateResult, IDeleteResult, IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { computeItemsAndPages, convertToObjetId } from 'src/common/utils/mongo.util';
import { hashPass } from 'src/common/utils/security.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, User } from './schemas/user.schema';
import { isExistMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { SignUpSellerDto } from 'src/auth/dto/signup-seller.dto';
import { UsersRepository } from './users.repository';
import { KeyStoreService } from '../key-store/key-store.service';
import { UpdateUserTransform } from './transform/update-user.transform';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { IsActiveEnum, SortEnum } from 'src/common/enums/index.enum';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly keyStoreService: KeyStoreService,
    private readonly updateUserTransform: UpdateUserTransform
  ) { }
  //CREATE//
  async createSeller(payload: SignUpSellerDto) {
    try {
      //is not exist email
      const { email, password: plain } = payload;
      if (await this.usersRepo.isExistByQuery({ email })) {
        throw new ConflictException(isExistMessage('email'));
      }
      //hash password
      const password = await hashPass(plain);
      //role
      const role = "SELLER";
      //create a user
      let created = await this.usersRepo.createOne({
        ...payload,
        password,
        role
      } as any); //{ password: unselect, ... }
      if (!created) {
        throw new BadRequestException("Có lỗi khi tạo một seller");
      }
      const { password: hide, ...newUser } = created;
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async createClient(payload: SignUpSellerDto) {
    try {
      //is not exist email
      const { email, password: plain } = payload;
      if (await this.usersRepo.isExistByQuery({ email })) {
        throw new ConflictException(isExistMessage('email'));
      }
      //hash password
      const password = await hashPass(plain);
      //role
      const role = "CLIENT";
      //create a user
      let created = await this.usersRepo.createOne({
        ...payload,
        password,
        role
      } as any); //{ password: unselect, ... }
      if (!created) {
        throw new BadRequestException("Có lỗi khi tạo một client");
      }
      const { password: hide, ...newUser } = created;
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(payload: CreateUserDto) {
    //transform
    try {
      // is exist mail
      const { email, password } = payload;
      const isExist = await this.usersRepo.isExistByQuery({ email });
      if (isExist) {
        throw new ConflictException(isExistMessage('email'));
      }
      // hash password
      const hash = await hashPass(password);
      //role
      const role = "ADMIN";
      //create a user
      let created = await this.usersRepo.createOne({
        ...payload,
        password: hash,
        role
      } as any); //{ password: unselect, ... }
      if (!created) {
        throw new BadRequestException("Có lỗi khi tạo một admin");
      }
      //create key store
      const createdKeyStore = await this.keyStoreService.createOne({ userId: created._id, verifyToken: null });
      if (!createdKeyStore) {
        throw new BadRequestException("Có lỗi khi cập nhật một keyStore");
      }
      //return
      const { password: hide, ...newUser } = created;
      return newUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Có lỗi khi tạo một admin");
    }
  }

  async updateOne(payload: UpdateUserDto) {
    const { id, ...newPayload } = await this.updateUserTransform.transform(payload);
    const updated = await this.usersRepo.updateOneByQuery(newPayload, { _id: id });
    if (!updated) {
      throw new NotFoundException(notFoundIdMessage('user id', id));
    }
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  async updateIsActive(userId: IKey, isActive: IsActiveEnum) {
    const payload = { isActive: isActive ? true : false };
    const updated = await this.usersRepo.updateOneByQuery(payload, { _id: userId });
    if (!updated) {
      throw new NotFoundException(notFoundIdMessage('user id', userId));
    }
    return updated ? { updatedCount: 1 } : { updatedCount: 0 };
  }

  //QUERY//
  async findAllByQuery(
    {
      page = 1,
      limit = 24,
      sort = SortEnum.LATEST,
      ...query
    }: QueryUserDto,
    isActive = IsActiveEnum.ACTIVE
  ) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const { data, metadata } = await this.usersRepo.findAllByQuery(
      page, limit, sort, unselect, { ...query, isActive: isActive ? true : false }
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return {
      data,
      metadata: { page, limit, items, pages },
    };
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const user = await this.usersRepo.findOneByQuery({ email });
    return user;
  }

  async findOneById(userId: IKey) {
    const unselect = ['deletedAt', 'isDeleted', '__v', 'password'];
    const found = await this.usersRepo.findOneById(userId, unselect);
    if (!found) {
      throw new NotFoundException(notFoundIdMessage('user id', userId));
    }
    return found;
  }
}
