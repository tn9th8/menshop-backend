import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDoc, OrderPartial } from './schemas/order.schema';
import { SortEnum } from 'src/common/enums/index.enum';
import { Result } from 'src/common/interfaces/response.interface';
import { toDbPopulates, toDbSelect, toDbSkip, toDbSort } from 'src/common/utils/mongo.util';
import { IReference } from 'src/common/interfaces/index.interface';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: SoftDeleteModel<OrderDoc>
  ) { }
  //CREATE//
  async createOrder(
    payload: Order
  ): Promise<OrderDoc | null> {
    try {
      const { _doc: created } = await this.orderModel.create(payload) as any;
      return created;
    } catch (error) {
      console.log('>>> Exception: OrdersRepository: createOrder: ' + error);
      return null;
    }
  }
  //UPDATE//
  async updateOne(
    document: OrderPartial, query: any
  ): Promise<OrderDoc | null> {
    const updated = await this.orderModel.findOneAndUpdate(query, document, { new: true }).lean();
    return updated || null;
  }

  //QUERY//
  async findAll(
    query: any, select: string[], refers: IReference[] = []
  ): Promise<Array<OrderDoc>> {
    const data = this.orderModel.find(query)
      .select(toDbSelect(select))
      .populate(toDbPopulates(refers))
      .sort({ updatedAt: -1 })
      .lean();
    return data;
  }

  async findOne(query: any, select: string[], refers: IReference[] = []) {
    const found = await this.orderModel.findOne(query)
      .populate(toDbPopulates(refers))
    return found;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
