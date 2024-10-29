/**
    @item FIXED_AMOUNT : to discount by a money amount
    @item PERCENTAGE : to discount by percentage
 */
export enum DiscountType {
    FIXED_AMOUNT = 'fixedAmount',
    PERCENTAGE = 'percentage'
}

/**
    @item ALL : apply to all products of shop
    @item SPECIFIC : apply to specificProducts
 */
export enum DiscountApplyTo {
    ALL = 'all',
    SPECIFIC = 'specific'
}