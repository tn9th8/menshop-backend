import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { hashPass } from 'src/common/utils/hashing.security';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.scheme';



@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) { }

  async create(createUserDto: CreateUserDto) {
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

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    const status = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
    return status;
  }

  async remove(id: string) {
    const status = await this.userModel.softDelete({ _id: id })
    return status;
  }
}
