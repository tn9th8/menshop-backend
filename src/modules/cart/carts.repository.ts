import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum } from 'src/common/enums/index.enum';
import { IReference } from 'src/common/interfaces/index.interface';
import { toDbSelect, toObjetId, toObjetIds } from 'src/common/utils/mongo.util';
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

  async createOne(
    document: Cart
  ): Promise<CartDoc | null> {
    try {
      const { _doc: created } = await this.cartModel.create(document) as any;
      return created;
    } catch (error) {
      console.log('>>> Exception: CartsRepository: createOne: ' + error);
      return null;
    }
  }

  //UPDATE//
  async updateOneByQuery(
    payload: UpdateQuery<CartPartial>, query: any,
  ): Promise<CartDoc | null> {
    const options = { new: true };
    const upserted = await this.cartModel.findOneAndUpdate(query, payload, options).lean();
    return upserted || null;
  }

  //EXIST//
  async isExistByQuery(query: any) {
    const isExist = await this.cartModel.exists(query);
    return isExist ? true : false;
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
      { $match: query },
      { $unwind: "$productItems" },  //Phân tách mảng productItems để xử lý từng sản phẩm
      // { $sort: { "productItems.updatedAt": -1 } }, //Sort các items trong 1 shop
      { $addFields: { "productItems.product": { $toObjectId: "$productItems.product" } } }, //chuyển product sang object để join
      {
        $lookup: {
          from: 'products', //collections
          localField: "productItems.product",
          foreignField: "_id",
          as: "product",
          pipeline: [{ $project: { _id: 1, name: 1, price: 1, thumb: 1 } }]
        }
      },
      {
        $lookup: {
          from: "inventories", //collections
          localField: "productItems.product",
          foreignField: "product",
          as: "inventory",
          pipeline: [{ $project: { _id: 0, stock: 1, sold: 1 } }]
        }
      },
      {
        $addFields: {
          "product.sold": { $arrayElemAt: ["$inventory.sold", 0] },
          "product.stock": { $arrayElemAt: ["$inventory.stock", 0] }
        }
      },
      {
        $project: { inventory: 0 }
      },
      {
        $group: {
          _id: { $toObjectId: "$productItems.shop" },
          productItems: {
            $push: {
              _id: "$productItems._id",
              product: { $arrayElemAt: ["$product", 0] },
              variant: "$productItems.variant",
              quantity: "$productItems.quantity",
              updatedAt: "$productItems.updatedAt"
            }
          }
        }
      },
      { $sort: { "productItems.updatedAt": -1 } }, //sort các productItems của các shop
      {
        $lookup: {
          from: 'shops',
          localField: "_id",
          foreignField: "_id",
          as: "shop",
          pipeline: [{ $project: { _id: 1, name: 1 } }]
        }
      },
      { $addFields: { "shop": { $arrayElemAt: ["$shop", 0] } } }, //_id là 1 mảng 1 item. Dùng $arrayElemAt 0 để item này
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

  //checkout
  /*
   * @param productItems: string => IKey[]
   */
  async checkProductItems(clientId: any, productItemIds: any, shopId: any) {
    const cart = await this.cartModel.aggregate([
      { $match: { client: toObjetId(clientId) } },
      { $unwind: '$productItems' },
      {
        $match: {
          'productItems._id': { $in: toObjetIds(productItemIds) },
          'productItems.shop': toObjetId(shopId)
        },
      },
      {
        $lookup: {
          from: 'products', // tên collection
          localField: 'productItems.product',
          foreignField: '_id',
          as: 'product',
          pipeline: [{ $project: { _id: 1, name: 1, thumb: 1, price: 1 } }]
        }
      },
      {
        $project: {
          _id: 0,
          cartProductItem: '$productItems._id', // Không trả về _id của productItem
          product: {
            $arrayElemAt: ['$product', 0]
          },
          variant: '$productItems.variant',
          quantity: '$productItems.quantity',
        }
      }
    ]);
    return cart;
  }
}
