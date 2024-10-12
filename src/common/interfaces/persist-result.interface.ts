import { PartialType } from "@nestjs/mapped-types";
import mongoose, { UpdateWriteOpResult } from "mongoose";

export interface ICreateResult {
    id: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

export interface IUpdateResult extends UpdateWriteOpResult { }

export interface IDeleteResult {
    deleted: number,
}