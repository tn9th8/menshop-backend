import mongoose from "mongoose";

export interface IBaseDocument {
    _id: mongoose.Types.ObjectId;
    isDeleted: false;
    deletedAt: boolean;
    createdAt: Date;
    updatedAt: Date;
}
