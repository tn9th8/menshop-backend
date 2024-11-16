import { Injectable, PipeTransform } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { cleanNullishAttrs, isNotEmptyOrException, trims } from "src/common/utils/index.util";


@Injectable()
export class CreateUserTransform implements PipeTransform {
    async transform(bodyValue: CreateUserDto) {
        let { name, email, password, phone, role, age, gender, avatar } = bodyValue;
        [name] = trims([name]);
        //string is not ""
        isNotEmptyOrException([name], ['name']);
        //clean partial attrs is nullish
        const partials = cleanNullishAttrs({ age, gender, avatar, phone });
        const cleaned: CreateUserDto = { name, email, password, role, ...partials };
        return cleaned;
    }
}