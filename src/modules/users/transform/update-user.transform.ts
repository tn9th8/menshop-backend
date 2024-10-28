import { BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { isExistMessage, isObjectIdMessage, notEmptyMessage, notFoundIdMessage } from 'src/common/utils/exception.util';
import { cleanNullishAttrs } from 'src/common/utils/index.util';
import { toObjetId } from 'src/common/utils/mongo.util';
import { trim } from 'src/common/utils/pipe.util';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../users.repository';

@Injectable()
export class UpdateUserTransform implements PipeTransform {
    constructor(private readonly usersRepository: UsersRepository) { }

    async transform(value: UpdateUserDto) {
        let { id } = value;

        //id: objectId
        id = toObjetId(id);
        if (!id) {
            throw new BadRequestException(isObjectIdMessage('id param', id))
        }
        if (!await this.usersRepository.isExistById(id)) {
            throw new NotFoundException(notFoundIdMessage('id param', id));
        }

        const transformed: UpdateUserDto = cleanNullishAttrs({ ...value, id });
        return transformed;
    }
}
