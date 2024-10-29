import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { toDbSelect, toDbSelectOrUnselect, toDbSkip, toDbSort } from 'src/common/utils/mongo.util';
import { Discount, DiscountDoc, DiscountPartial } from './schemas/discount.schema';

@Injectable()
export class DiscountsRepository {
  constructor(
    @InjectModel(Discount.name)
    private readonly discountModel: SoftDeleteModel<DiscountDoc>
  ) { }
  //CREATE//
  async createDiscount(
    payload: Discount
  ): Promise<DiscountDoc | null> {
    try {
      const { _doc: created } = await this.discountModel.create(payload) as any;
      return created;
    } catch (error) {
      console.log('>>> Error: DiscountsRepository: createDiscount: ' + error);
      return null;
    }
  }
  //UPDATE//
  async updateDiscountByQuery(
    payload: DiscountPartial, query: any, options: any = { new: true }
  ): Promise<DiscountDoc | null> {
    const updated = (await this.discountModel.findOneAndUpdate(query, payload, options).lean());
    return updated || null;
  }
  //EXIST
  async existDiscountByQuery(query: any): Promise<{ _id: IKey } | null> {
    const isExist = await this.discountModel.exists(query).lean();
    return isExist || null;
  }
  //QUERY ALL//
  async findDiscountsByQuery(
    page: number, limit: number, sort: SortEnum, query: any, select: string[]
  ): Promise<Result<DiscountDoc>> {
    const [queriedCount, data] = await Promise.all([
      this.discountModel.countDocuments(query),
      this.discountModel.find(query)
        .select(toDbSelect(select))
        .sort(toDbSort(sort))
        .skip(toDbSkip(page, limit))
        .limit(limit)
        .lean()
    ]);
    return { data, metadata: { queriedCount } };
  }
  //QUERY ONE//
  /**
   * Tìm kiếm 1 doc đầy đủ với query, select/unselect, references
   * @param query
   * @param isSelect
   * @param select
   * @param references
   * @returns
   */
  async findDiscountByQuery(
    query: any, isSelect: isSelectEnum, select: string[], references: IReference[]
  ): Promise<Discount | null> {
    const found = await this.discountModel.findOne(query)
      .select(toDbSelectOrUnselect(isSelect, select))
      .populate({ path: references[0].attribute, select: toDbSelect(references[0].select) })
      .populate({ path: references[1].attribute, select: toDbSelect(references[1].select) })
      .populate({ path: references[2].attribute, select: toDbSelect(references[2].select) })
      .lean();
    return found || null;
  }
  /**
   * Tìm kiếm 1 doc ngắn gọn với chỉ query, select
   * @param query
   * @param select
   * @returns
   */
  async findDiscountByQuerySelect(
    query: any, select: string[]
  ): Promise<Discount | null> {
    const found = await this.discountModel.findOne(query)
      .select(toDbSelect(select))
      .lean();
    return found || null;
  }
}
