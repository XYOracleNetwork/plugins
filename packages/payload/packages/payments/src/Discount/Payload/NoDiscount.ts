import { Discount, DiscountSchema } from './Discount.ts'

export const NO_DISCOUNT: Discount = {
  schema: DiscountSchema,
  amount: 0,
  currency: 'USD',
}
