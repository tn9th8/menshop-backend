import { BadRequestException } from "@nestjs/common";
import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

/**
 * function check is object id
 * @param id string
 * @returns boolean
 */
export const isObjetId = (id: string): boolean => {
    if (!mongoose.Types.ObjectId.isValid(id)) { return false; }
    return true;
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
 * plugin slug for product.name
 * @param schema product
 */
export const slugNamePlugin = (schema: Schema) => {
    schema.pre('save', function (next) {
        this.slug = slugify(this.name, { lower: true })
        next();
    })
}

/**
 * plugin slug for category.displayName
 * @param schema product
 */
export const slugDisplayNamePlugin = (schema: Schema) => {
    schema.pre('save', function (next) {
        this.slug = slugify(this.displayName, { lower: true })
        next();
    })
}