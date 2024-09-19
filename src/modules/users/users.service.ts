import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ICreateResult, IDeleteResult, IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { isObjetId } from 'src/common/utils/mongo.util';
import { hashPass } from 'src/common/utils/security.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { User } from './schemas/user.scheme';
import mongoose from 'mongoose';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<IUser>) { }

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

  async findAll(): Promise<Array<IUser>> {
    const users = await this.userModel.find();
    return users;
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

  async updateRefreshToken(_id: mongoose.Types.ObjectId, refreshToken: string, expiresIn: number): Promise<IUpdateResult> {
    const refreshExpires = expiresIn ? new Date(Date.now() + expiresIn) : null; // in: milliseconds, out: Date
    return await this.userModel.updateOne({ _id }, { refreshToken, refreshExpires });
  }

  async findByRefreshToken(refreshToken: string): Promise<IUser> {
    return await this.userModel.findOne({ refreshToken });
  }

  async updateVerifyToken(_id: mongoose.Types.ObjectId, verifyToken: string, expiresIn: number): Promise<IUpdateResult> {
    const refreshExpires = expiresIn ? new Date(Date.now() + expiresIn) : null; // input: milliseconds, output: Date
    return await this.userModel.updateOne({ _id }, { verifyToken, refreshExpires });
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
