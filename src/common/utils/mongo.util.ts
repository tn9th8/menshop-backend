import { Expression, FilterQuery, Schema, Types } from "mongoose";
import slugify from "slugify";
import { ProductSortEnum } from "../enums/query.enum";
import { MongoSort } from "../interfaces/mongo.interface";
import { IKey } from "../interfaces/index.interface";

//>>>METHODS
export const computeSkipAndSort = (
    limit: number = 60, page: number = 1, rawSort: string = ProductSortEnum.POPULATE
) => {
    const skip = limit * (page - 1);
    const sort: MongoSort =
        rawSort === ProductSortEnum.CTIME ?
            { updatedAt: -1 } :
            { updatedAt: 1 };
    return { skip, sort };
}

export const computeTotalItemsAndPages = (meta: any, limit: number = 60) => {
    const items = meta.count;
    const pages = Math.ceil(items / limit);
    return { items, pages };
}


/**
 * function check is objectId
 * @param id string or ObjectId
 * @returns true or boolean
 */
export const convertToObjetId = (id: string | Types.ObjectId): Types.ObjectId => {
    try {
        return new Types.ObjectId(id);
    } catch (error) {
        return null;
    }
}

export const toObjetId = (id: IKey | string): IKey => {
    //check !falsy
    if (!id) { return null; }
    try {
        return new Types.ObjectId(id); //new a object when id is undefined => bad
    } catch (error) {
        return null;
    }
}

export const buildQueryByShop = <T>(shopId: Types.ObjectId, query?: FilterQuery<T>): FilterQuery<T> => {
    if (shopId) {
        query = { ...query, shopId };
    }
    return query;
}

/**
 * convert ['name', 'thumb'] => {name: 1, thumb: 1}
 * @param select : array of the selected attributes
 * @returns : object of the selected attributes
 */
export const convertSelectAttrs = (select = []) => {
    return Object.fromEntries(select.map(attribute => [attribute, 1]));
};

/**
 * convert ['name', 'thumb'] => {name: 0, thumb: 0}
 * @param select : array of the unselected attributes
 * @returns : object of the unselected attributes
 */
export const convertUnselectAttrs = (select = []) => {
    return Object.fromEntries(select.map(attribute => [attribute, 0]));
};

//>>>PROP
/**
 * Prop() ratingStar
 * @schema product
 */
export const ratingStarProp = {
    default: 5.0,
    required: true,
    validate: {
        validator: (value: number) => value >= 1.0 && value <= 5.0,
        message: 'ratingsAverage nên ở ở giữa 1.0 và 5.0'
    },
    set: (value: number) => Math.round(value * 10) / 10 //4.648 => 46.48 => 46 => 4.6
    // min: [1.0, 'ratingsAverage is not under 1.0'], //bug
    // max: [5.0, 'ratingsAverage is not above 5.0'],
};

//>>>PLUGINS
/**
 * plugin timestamps
 * @param schema all in
 */
export const timestampsPlugin = (schema: Schema) => {
    // hook
    schema.add({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    });
    // hook
    schema.pre('save', function (next) {
        this.updatedAt = Date.now();
        next();
    })
}

/**
 * plugin slug
 * @param schema category, need, product, variation
 */
export const slugPlugin = (schema: Schema) => {
    schema.pre('save', function (next) {
        this.slug = slugify(this.displayName, { lower: true })
        next();
    })
}

/**
 * plugin publish
 * @param schema product
 */
export const publishPlugin = (schema: Schema) => {
    schema.pre('save', function (next) {
        console.log('update');
        if (this.isPublished === true || this.isPublished === false) {
            this.publishedAt = Date.now();
        }
        next();
    })
}