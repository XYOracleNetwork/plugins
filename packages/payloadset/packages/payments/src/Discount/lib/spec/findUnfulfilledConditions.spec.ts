import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Coupon } from '@xyo-network/payment-payload-plugins'
import { FixedAmountCouponSchema } from '@xyo-network/payment-payload-plugins'
import type { SchemaPayload } from '@xyo-network/schema-payload-plugin'
import { SchemaSchema } from '@xyo-network/schema-payload-plugin'
import {
  beforeEach, describe, it, vi,
} from 'vitest'

import { findUnfulfilledConditions } from '../findUnfulfilledConditions.ts'

describe('findUnfulfilledConditions', () => {
  const nbf = Date.now()
  const exp = Date.now() + 10_000_000
  // Coupons
  const validCoupon: Coupon = {
    amount: 10, exp, nbf, schema: FixedAmountCouponSchema, currency: 'USD',
  }

  // Conditions
  const BUY_TWO: SchemaPayload = {
    schema: SchemaSchema,
    definition: {
      type: 'array',
      contains: {
        type: 'object',
        properties: {
          schema: { type: 'string', const: 'network.xyo.escrow.terms' },
          assets: { type: 'array', minItems: 2 },
        },
        required: ['schema', 'assets'],
      },
    },
  }
  // TODO: Appraisal payload does not exceed X
  const APPRAISAL_DOES_NOT_EXCEED_AMOUNT: SchemaPayload = {
    schema: SchemaSchema,
    definition: {
      type: 'array',
      contains: {
        type: 'object',
        properties: {
          schema: { type: 'string', const: 'network.xyo.escrow.terms' },
          assets: { type: 'array', minItems: 2 },
        },
        required: ['schema', 'assets'],
      },
    },
  }

  const validRules = [
    [BUY_TWO],
    [APPRAISAL_DOES_NOT_EXCEED_AMOUNT],
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('when conditions are fulfilled', () => {
    it.each(validRules)('Returns empty array', async (rule) => {
      const coupon: Coupon = { ...validCoupon, conditions: [await PayloadBuilder.dataHash(rule)] }
      const payloads = [rule]
      const results = await findUnfulfilledConditions(coupon, payloads)
      expect(results).toEqual([])
    })
  })
  describe('when conditions are not fulfilled', () => {
    it.each(validRules)('Returns all unfulfilled condition hashes', async (rule) => {
      const conditions = [await PayloadBuilder.dataHash(rule)]
      const coupon: Coupon = { ...validCoupon, conditions }
      const payloads = [rule]
      const results = await findUnfulfilledConditions(coupon, payloads)
      expect(results).toEqual(conditions)
    })
  })
})
