import mongoose from "mongoose";
import { UserDocument } from "../schemas/user.scheme";

export interface IUser extends UserDocument {
    _id: mongoose.Types.ObjectId,
    isDeleted: false,
    deletedAt: boolean,
    createdAt: Date,
    updatedAt: Date,
    __v: number,
}
