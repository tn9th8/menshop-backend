import { FilterQuery, PopulateOptions, Schema, Types } from "mongoose";
import slugify from "slugify";
import { IsSelectEnum, SortEnum } from "../enums/index.enum";
import { IDbSort, IKey, IReference } from "../interfaces/index.interface";
import { Metadata } from "../interfaces/response.interface";

//>>>METHODS
export const computeItemsAndPages = (metadata: Metadata, limit: number = 24) => {
    const items = metadata.queriedCount;
    const pages = Math.ceil(items / limit);
    return { items, pages };
}

/**
 * function check is objectId
 * @param id string or ObjectId
 * @returns true or boolean
 */
export const toObjetId = (id: IKey | string): IKey | null => {
    /**
     * new Types.ObjectId(null/undefined): create id => bad => check !falsy
     * new Types.ObjectId('xx46@@'): throw bug => bad => catch
     */
    if (!id) { return null; } //check !falsy
    try {
        return new Types.ObjectId(id);
    } catch (error) {
        console.log('>>> toObjetId: ' + error)
        return null;
    }
}

export const toObjetIds = (ids: IKey[] | string[], isCleanEachNull = true): IKey[] => {
    ids = ids.map((id: IKey | string) => toObjetId(id));
    ids = isCleanEachNull ? ids.filter(Boolean) : ids; //[]
    return ids;

}

export const buildQueryByShop = <T>(shopId: Types.ObjectId, query?: FilterQuery<T>): FilterQuery<T> => {
    if (shopId) {
        query = { ...query, shopId };
    }
    return query;
}

export const buildQueryModelIdSellerId = <T>(modelId: IKey, sellerId: IKey): FilterQuery<T> => {
    const newQuery = {
        _id: modelId,
        seller: sellerId
    };
    return newQuery;
}

export const buildQueryExcludeId = (query: any, excludedId: IKey,) => {
    const newQuery = {
        ...query,
        _id: { $ne: excludedId } //ne: not equal => exclude a id document
    };
    return newQuery;
}

export const buildQueryLike = (fields: string[], values: string[]) => {
    const obj: any = {};
    fields.forEach((field, index) => {
        const value = values[index];
        if (value) {
            obj[field] = { $regex: new RegExp(value, 'i') };
        }
    });
    return obj;
};

export const toDbSort = (sort: SortEnum) => {
    const dbSort: IDbSort =
        sort == SortEnum.LATEST ? { updatedAt: -1 }
            : sort == SortEnum.OLDEST ? { updatedAt: 1 }
                : sort == SortEnum.NAME_AZ ? { name: 1 }
                    : sort == SortEnum.NAME_ZA ? { name: -1 }
                        : { updatedAt: -1 } //default SortEnum.LATEST
    return dbSort;
}

export const toDbSkip = (page: number, limit: number) => {
    const dbSkip = limit * (page - 1); //skip, offset là 1
    return dbSkip;
}

export const toDbPopulates = (refers: IReference[]) => {
    const populates: PopulateOptions[] = refers.map((item) => {
        const populate = { path: item.attribute, select: toDbSelect(item.select) };
        return populate;
    });
    return populates;
}

export const toDbSelectOrUnselect = (select: string[], isSelect: IsSelectEnum,) => {
    const dbSelectOrUn =
        isSelect === IsSelectEnum.SELECT ? toDbSelect(select)
            : isSelect === IsSelectEnum.UNSELECT ? toDbUnselect(select) : null;
    return dbSelectOrUn;
};
/**
 * convert ['name', 'thumb'] => {name: 1, thumb: 1}
 * @param select : array of the selected attributes
 * @returns : object of the selected attributes
 */
export const toDbSelect = (select = []) => {
    return Object.fromEntries(select.map(attribute => [attribute, 1]));
};
/**
 * convert ['name', 'thumb'] => {name: 0, thumb: 0}
 * @param select : array of the unselected attributes
 * @returns : object of the unselected attributes
 */
export const toDbUnselect = (select = []) => {
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
        this.slug = slugify(this.name, { lower: true })
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