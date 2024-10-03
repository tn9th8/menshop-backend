import { BadRequestException } from "@nestjs/common";
import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

/**
 * function check is object id
 * @param id string
 * @returns boolean
 */
export const isObjetId = (id: string): boolean => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Không thể tìm với id=${id}`)
    }
    return true
}

/**
 * plugin timestamps
 * @param schema
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
 * plugin slug for product
 * @param schema product
 */
export const slugPlugin = (schema: Schema) => {
    schema.pre('save', function (next) {
        this.product_slug = slugify(this.product_name, { lower: true })
        next();
    })
}
