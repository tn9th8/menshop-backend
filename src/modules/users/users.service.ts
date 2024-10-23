import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Moment } from 'moment';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SignUpClientDto } from 'src/auth/dto/signup-client.dto';
import { ICreateResult, IDeleteResult, IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { convertToObjetId } from 'src/common/utils/mongo.util';
import { hashPass } from 'src/common/utils/security.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, User } from './schemas/user.scheme';
import { isExistMessage } from 'src/common/utils/exception.util';
import { SignUpSellerDto } from 'src/auth/dto/signup-seller.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<IUser>,
    private readonly usersRepo: UsersRepository
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
        throw new BadRequestException("Có lỗi khi tạo một seller");
      }
      const { password: hide, ...newUser } = created;
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  //OLD//
  async create(createUserDto: CreateUserDto | SignUpClientDto): Promise<ICreateResult> {
    // is exist mail
    const { email, password } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new ConflictException(isExistMessage('email'));
    }

    // hash password
    const hash = await hashPass(password);

    // create
    const user = await this.userModel.create({
      ...createUserDto,
      password: hash,
    });
    return {
      id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findAll(queryString: string) {
    // page = current; limit = size; offset = skip
    const { filter, sort, projection, population } = aqp(queryString);
    const { page, size, ...condition } = filter // delete filter.page
    // limit, offset
    let offset = (+page - 1) * (+size);
    let limit = +size || 10;
    // use Promise.all to perform 2 queries parallel
    const [totalItems, result] = await Promise.all([
      this.userModel.countDocuments(condition),
      this.userModel.find(condition)
        .skip(offset)
        .limit(limit)
        .sort(sort as any) // @ts-ignore: Unreachable code error
        .populate(population)
        .exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      meta: {
        page,
        size: limit,
        pages: totalPages,
        items: totalItems,
      },
      result //kết quả query
    }

  }

  async findById(_id: string): Promise<IUser | undefined> {
    convertToObjetId(_id);
    const user = await this.userModel.findById(_id).select('-password');
    return user;
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(updateUserDto: UpdateUserDto): Promise<IUpdateResult> {
    const { id, email, password, phone, ...updateFields } = updateUserDto;
    convertToObjetId(id);
    const result = await this.userModel.updateOne({ _id: id }, { ...updateFields },);
    return result;
  }

  async updateRefreshToken(_id: mongoose.Types.ObjectId, refreshToken: string, refreshExpires: Moment): Promise<IUpdateResult> {
    return await this.userModel.updateOne({ _id }, { refreshToken, refreshExpires });
  }

  async findByRefreshToken(refreshToken: string): Promise<IUser> {
    return await this.userModel.findOne({ refreshToken });
  }

  async updateVerifyToken(_id: mongoose.Types.ObjectId, verifyToken: string, verifyExpires: Moment): Promise<IUpdateResult> {
    return await this.userModel.updateOne({ _id }, { verifyToken, verifyExpires });
  }

  async findByVerifyToken(verifyToken: string): Promise<IUser> {
    return await this.userModel.findOne({ verifyToken });
  }

  async remove(_id: string): Promise<IDeleteResult> {
    convertToObjetId(_id);
    const result = await this.userModel.softDelete({ _id })
    return result;

  }
}
