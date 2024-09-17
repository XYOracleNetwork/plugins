import type { Payload } from '@xyo-network/payload-model'
import type { Coupon } from '@xyo-network/payment-payload-plugins'

export const areConditionsFulfilled = (coupon: Coupon, payloads: Payload[]): boolean => {
  // If there are no conditions, then they are fulfilled
  if (!coupon.conditions || coupon.conditions.length === 0) return true

  // TODO: Implement condition fulfillment
  return false
}
