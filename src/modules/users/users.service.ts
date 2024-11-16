import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IsActiveEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey } from 'src/common/interfaces/index.interface';
import { isExistMessage, notFoundIdMessage, notFoundMessage } from 'src/common/utils/exception.util';
import { computeItemsAndPages } from 'src/common/utils/mongo.util';
import { hashPass } from 'src/common/utils/security.util';
import { SignUpSellerDto } from 'src/shared/auth/dto/signup-seller.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UsersFactory } from './services/users.factory';
import { UsersRepository } from './users.repository';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly usersFactory: UsersFactory
  ) { }
  /**
   * @param body {
   *    name *
   *    email *
   *    phone
   *    password *
   *    role *
   *    age
   *    gender
   *    avatar
   * }
   * @returns created object that excluded password
   */
  async createUserFactory(body: any) {
    const created = await this.usersFactory.createUser(body);
    return created;
  }

  //UPDATE
  async updateOne(body: UpdateUserDto) {
    const { id, password, ...payload } = body;
    //ko cho update password
    const updated = await this.usersRepo.updateOneByQuery(
      { ...payload }, { _id: id });
    if (!updated)
      throw new NotFoundException(notFoundMessage('user'));
    const { password: hide, ...newUser } = updated;
    return newUser;
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
    { page = 1, limit = 24, sort = SortEnum.LATEST, ...query }: QueryUserDto,
    isActive = IsActiveEnum.ACTIVE
  ) {
    const unselect = ['deletedAt', 'isDeleted', '__v'];
    const { data, metadata } = await this.usersRepo.findAllByQuery(
      page, limit, sort, unselect, { ...query, isActive: isActive ? true : false }
    );
    const { items, pages } = computeItemsAndPages(metadata, limit);
    return { data, metadata: { page, limit, items, pages } };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.usersRepo.findOneByQuery({ email }) || null;
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

  async findOwnProfile(user: IAuthUser) {
    const profile = await this.findOneById(user.id);
    return profile;
  }
}
