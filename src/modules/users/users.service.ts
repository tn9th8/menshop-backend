import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Moment } from 'moment';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { ICreateResult, IDeleteResult, IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { isObjetId } from 'src/common/utils/mongo.util';
import { hashPass } from 'src/common/utils/security.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, User } from './schemas/user.scheme';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<IUser>
  ) { }

  async create(createUserDto: CreateUserDto | SignUpDto): Promise<ICreateResult> {
    // is exist mail
    const { email, password } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác`);
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
    isObjetId(_id);
    const user = await this.userModel.findById(_id).select('-password');
    return user;
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(updateUserDto: UpdateUserDto): Promise<IUpdateResult> {
    const { id, email, password, phone, ...updateFields } = updateUserDto;
    isObjetId(id);
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
    isObjetId(_id);
    const result = await this.userModel.softDelete({ _id })
    return result;

  }
}
