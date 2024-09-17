import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IDeleteResult, IUpdateResult } from 'src/common/interfaces/persist-result.interface';
import { isObjetId } from 'src/common/utils/mongo.util';
import { hashPass } from 'src/common/utils/security.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { User } from './schemas/user.scheme';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<IUser>) { }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
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
    return user;
  }

  async findAll(): Promise<Array<IUser>> {
    const users = await this.userModel.find();
    return users;
  }

  async findOneById(id: string): Promise<IUser | undefined> {
    isObjetId(id);
    const user = await this.userModel
      .findById(id)
      .select('-password');
    return user;
  }

  async findOneByEmail(email: string): Promise<IUser | undefined> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(updateUserDto: UpdateUserDto): Promise<IUpdateResult> {
    const { id, email, password, phone, ...updateFields } = updateUserDto;
    isObjetId(id);
    const result = await this.userModel.updateOne({ _id: id }, { ...updateFields },);
    return result;
  }

  async remove(id: string): Promise<IDeleteResult> {
    isObjetId(id);
    const result = await this.userModel.softDelete({ _id: id })
    return result;

  }
}
