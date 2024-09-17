import type { WalletInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import { type HashLeaseEstimate, HashLeaseEstimateSchema } from '@xyo-network/diviner-hash-lease'
import type { IdPayload } from '@xyo-network/id-payload-plugin'
import { IdSchema } from '@xyo-network/id-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Coupon, EscrowTerms } from '@xyo-network/payment-payload-plugins'
import { EscrowTermsSchema, FixedAmountCouponSchema } from '@xyo-network/payment-payload-plugins'
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

  let buyer: WalletInstance
  let seller: WalletInstance
  const baseTerms: EscrowTerms = {
    schema: EscrowTermsSchema, appraisals: [], exp, nbf,
  }
  const appraisal: HashLeaseEstimate = {
    schema: HashLeaseEstimateSchema, price: 10, currency: 'USD', exp, nbf,
  }

  const asset1: IdPayload = { schema: IdSchema, salt: nbf.toString() }
  const asset2: IdPayload = { schema: IdSchema, salt: exp.toString() }
  const assets = [asset1, asset2]

  beforeEach(async () => {
    vi.clearAllMocks()
    buyer = await HDWallet.random()
    seller = await HDWallet.random()
    baseTerms.buyer = [buyer.address]
    baseTerms.seller = [seller.address]
    baseTerms.appraisals = [await PayloadBuilder.dataHash(appraisal)]
    baseTerms.assets = await PayloadBuilder.dataHashes(assets)
  })
  describe('when conditions are fulfilled', () => {
    it.each(validRules)('Returns empty array', async (rule) => {
      const conditions = [await PayloadBuilder.dataHash(rule)]
      const coupon: Coupon = { ...validCoupon, conditions }
      const terms: EscrowTerms = { ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)] }
      const payloads = [terms, appraisal, coupon, rule, ...assets]
      const results = await findUnfulfilledConditions(coupon, payloads)
      expect(results).toEqual([])
    })
  })
  describe('when conditions are not fulfilled', () => {
    it.each(validRules)('Returns all unfulfilled condition hashes', async (rule) => {
      const conditions = [await PayloadBuilder.dataHash(rule)]
      const coupon: Coupon = { ...validCoupon, conditions }
      const terms: EscrowTerms = {
        ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], assets: [],
      }
      const payloads = [terms, appraisal, coupon, rule, ...assets]
      const results = await findUnfulfilledConditions(coupon, payloads)
      expect(results).toEqual(conditions)
    })
  })
})
