import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IsSelectEnum, SortEnum } from 'src/common/enums/index.enum';
import { IKey, IReference } from 'src/common/interfaces/index.interface';
import { Result } from 'src/common/interfaces/response.interface';
import { toDbPopulates, toDbSelect, toDbSelectOrUnselect, toDbSkip, toDbSort } from 'src/common/utils/mongo.util';
import { Discount, DiscountDoc, DiscountDocPartial, DiscountPartial } from './schemas/discount.schema';

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
      console.log('>>> Exception: DiscountsRepository: createDiscount: ' + error);
      return null;
    }
  }
  //UPDATE//
  async updateDiscountByQuery(
    payload: UpdateQuery<DiscountDocPartial>, query: any
  ): Promise<DiscountDoc | null> {
    const updated = await this.discountModel.findOneAndUpdate(query, payload, { new: true }).lean();
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
   * Tìm kiếm 1 doc đầy đủ với query, select/unselect, refers
   * @param query
   * @param isSelect
   * @param select
   * @param refers
   * @returns
   */
  async findDiscountByQueryRefer(
    query: any, select: string[], isSelect: IsSelectEnum, refers: IReference[] = [] //no refer
  ): Promise<Discount | null> {
    const found = await this.discountModel.findOne(query)
      .select(toDbSelectOrUnselect(select, isSelect))
      .populate(toDbPopulates(refers))
      .lean();
    return found || null;
  }
  /**
   * Tìm kiếm 1 doc ngắn gọn với chỉ query, select
   * @param query
   * @param select
   * @returns
   */
  async findDiscountByQueryRaw(
    query: any, select: string[] = [] //ko truyen select => select all
  ): Promise<DiscountDoc | null> {
    const found = await this.discountModel.findOne(query)
      .select(toDbSelect(select))
      .lean();
    return found || null;
  }
}
