import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum } from 'src/common/enums/index.enum';
import { IReference } from 'src/common/interfaces/index.interface';
import { toDbSelect } from 'src/common/utils/mongo.util';
import { Cart, CartDoc, CartPartial } from './schemas/cart.schema';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: SoftDeleteModel<CartDoc>
  ) { }
  //CREATE//
  async upsertOneByQuery(
    payload: UpdateQuery<CartPartial>, query: any
  ): Promise<CartDoc | null> {
    try {
      const options = { upsert: true, new: true };
      const upserted = await this.cartModel.findOneAndUpdate(query, payload, options).lean();
      return upserted || null;
    } catch (error) {
      console.log('>>> Exception: CartsRepository: upsertOneByQuery: ' + error);
      return null;
    }
  }
  //CREATE//
  async updateOneByQuery(
    payload: UpdateQuery<CartPartial>, query: any
  ): Promise<CartDoc | null> {
    const options = { new: true };
    const upserted = await this.cartModel.findOneAndUpdate(query, payload, options).lean();
    return upserted || null;
  }
  //QUERY ONE//
  /**
   * Tìm kiếm 1 doc đầy đủ với query, select/unselect, refers
   * @param query
   * @param isSelect
   * @param select
   * @param refers
   * @returns
   */
  async findOneByQueryRefer(
    query: any, select: string[], isSelect: IsSelectEnum, refers: IReference[] = [] //no refer
  ): Promise<any | null> {
    const found = await this.cartModel.aggregate([
      { $unwind: "$items" },  // Phân tách mảng items để xử lý từng sản phẩm
      {
        $group: {
          _id: { $toObjectId: "$items.shop" },
          products: { $push: { $toObjectId: "$items.product" } },
          quantity: { $push: "$items.quantity" },
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: "products",
          foreignField: "_id",
          as: "products",
          pipeline: [{ $project: { _id: 1, name: 1, price: 1, thumb: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'shops',
          localField: "_id",
          foreignField: "_id",
          as: "_id",
          pipeline: [{ $project: { _id: 1, name: 1 } }]
        }
      },
      { $addFields: { "shop": { $arrayElemAt: ["$_id", 0] } } },
      { $project: { _id: 0 } },
    ]);
    return found || null;
  }

  /**
 * Tìm kiếm 1 doc ngắn gọn với chỉ query, select
 * @param query
 * @param select
 * @returns
 */
  async findOneByQueryRaw(
    query: any, select: string[] = []
  ): Promise<CartDoc | null> {
    const found = await this.cartModel.findOne(query)
      .select(toDbSelect(select))
      .lean();
    return found || null;
  }
}
