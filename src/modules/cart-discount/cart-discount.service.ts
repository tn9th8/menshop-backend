import { Injectable } from '@nestjs/common';
import { IAuthUser } from 'src/common/interfaces/auth-user.interface';
import { CartsService } from '../cart/carts.service';
import { DiscountsService } from '../discounts/discounts.service';
import { GroupUserEnum, IsValidEnum } from 'src/common/enums/index.enum';

@Injectable()
export class CartDiscountService {
    constructor(
        private readonly cartsService: CartsService,
        private readonly discountsService: DiscountsService,
    ) { }


    async findMyCart(client: IAuthUser) {
        const foundCart = await this.cartsService.findMyCart(client);
        const newCart = [];
        for (const shopItem of foundCart) {
            const discounts = [];
            const { shop, productItems } = shopItem;
            const result = await this.discountsService.findDiscountsIsValid(
                { shop: shop._id } as any, IsValidEnum.VALID, GroupUserEnum.CLIENT);
            const foundDiscounts = result.data;
            // for (const discount of foundDiscounts) {
            //     const isOk = await this.discountsService.applyDiscountV2(
            //         { shop: shop._id, code: discount.code, productItems }, client, false
            //     );
            //     if (isOk) {
            //         discounts.push(discount);
            //     }
            // }

            newCart.push({ shop, discounts: foundDiscounts, productItems });
        }
        return newCart;
        // return found;
    }
}
