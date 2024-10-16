import { Schema, Types } from "mongoose";
import slugify from "slugify";

//>>> METHODS
/**
 * function check is objectId
 * @param id string or ObjectId
 * @returns boolean
 */
export const convertToObjetId = (id: string | Types.ObjectId): Types.ObjectId => {
    try {
        return new Types.ObjectId(id);
    } catch (error) {
        return null;
    }
}

export const buildQueryByShop = (shop: Types.ObjectId, query?: object): object => {
    if (shop) {
        query = { ...query, shop };
    }
    return query;
}

//>>> PROP
/**
 * Prop() ratingStar
 * @schema product
 */
export const ratingStarProp = {
    default: 5.0,
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
        if (this.isPublished) {
            this.publishedDate = Date.now();
        }
        next();
    })
}