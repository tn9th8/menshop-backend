import { BadRequestException } from "@nestjs/common";
import mongoose, { Schema } from "mongoose";

// function check is object id
export const isObjetId = (id: string): boolean => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Không thể tìm với id=${id}`)
    }
    return true
}

// plugin timestamps (hook, middleware)
export const timestampsPlugin = (schema: Schema) => {
    schema.add({
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    });

    schema.pre('save', function (next) {
        this.updatedAt = Date.now();
        next();
    })
}
