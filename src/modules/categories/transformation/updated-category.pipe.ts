import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isObjectIdMessage } from 'src/common/utils/exception.util';
import { convertToObjetId } from 'src/common/utils/mongo.util';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { trim, trimArray } from 'src/common/utils/pipe.util';

@Injectable()
export class UpdatedCategoryPipe implements PipeTransform {
    transform(updateCategoryDto: UpdateCategoryDto) {
        //name, displayName,
        let {
            id,
            name, displayName, description, attributes, specifications,
            children, brands, variations, needs,
        } = updateCategoryDto;
        let transformed: UpdateCategoryDto;

        //id is a required object id
        const objId = convertToObjetId(id);
        if (!objId) {
            throw new BadRequestException(isObjectIdMessage('id', id));
        }
        transformed = { ...transformed, id: objId };

        //trim name, displayName, description, attributes, specifications
        name = trim(name);
        const nameObj = name ? { name } : {};

        displayName = trim(displayName);
        const displayNameObj = displayName ? { displayName } : {};

        description = trim(description);
        const descriptionObj = description ? { description } : {};

        attributes = trimArray(attributes);
        const x = attributes ? { attributes } : {};

        // let attributesObj: Record<string, string[]>;
        // let specificationsOnj: Record<string, string[]>;
        console.log(transformed);

        return transformed;
    }
}