import type { Discount } from './Discount.ts'
import { DiscountSchema } from './Discount.ts'

export const NO_DISCOUNT: Discount = {
  schema: DiscountSchema,
  amount: 0,
  currency: 'USD',
}
