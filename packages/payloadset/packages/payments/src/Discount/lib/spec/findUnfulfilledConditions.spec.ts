/* eslint-disable unicorn/no-thenable */
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
  beforeEach, describe, it,
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
  const CONDITION_REQUIRES_BUYING_TWO = {
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
  const CONDITION_REQUIRES_APPRAISAL_DOES_NOT_EXCEED_AMOUNT = {
    schema: SchemaSchema,
    definition: {
      type: 'array',
      contains: {
        type: 'object',
        properties: { schema: { type: 'string', const: 'network.xyo.hash.lease.estimate' } },
        required: ['schema'],
      },
      items: {
        type: 'object',
        if: { properties: { schema: { type: 'string', const: 'network.xyo.hash.lease.estimate' } } },
        then: { properties: { price: { type: 'number', maximum: 20 } }, required: ['price'] },
      },
    },
  }

  const CONDITION_FOR_SPECIFIC_BUYER = {
    schema: SchemaSchema,
    definition: {
      type: 'array',
      contains: {
        type: 'object',
        properties: {
          schema: { type: 'string', const: 'network.xyo.escrow.terms' },
          buyer: {
            type: 'array', items: { type: 'string', const: '' }, minItems: 1,
          },
        },
        required: ['schema', 'buyer'],
      },
    },
  }

  const allConditions: SchemaPayload[] = [
    CONDITION_REQUIRES_BUYING_TWO,
    CONDITION_REQUIRES_APPRAISAL_DOES_NOT_EXCEED_AMOUNT,
    CONDITION_FOR_SPECIFIC_BUYER,
  ]

  let buyer: WalletInstance
  let seller: WalletInstance
  const baseTerms: EscrowTerms = {
    schema: EscrowTermsSchema, appraisals: [], exp, nbf, buyer: ['abcdefg'],
  }
  const appraisal1: HashLeaseEstimate = {
    schema: HashLeaseEstimateSchema, price: 10, currency: 'USD', exp, nbf,
  }
  const appraisal2: HashLeaseEstimate = {
    schema: HashLeaseEstimateSchema, price: 20, currency: 'USD', exp, nbf,
  }
  const appraisals = [appraisal1, appraisal2]

  const asset1: IdPayload = { schema: IdSchema, salt: nbf.toString() }
  const asset2: IdPayload = { schema: IdSchema, salt: exp.toString() }
  const assets = [asset1, asset2]

  beforeEach(async () => {
    buyer = await HDWallet.random()
    seller = await HDWallet.random()

    // Configure base terms
    baseTerms.buyer = [buyer.address]
    baseTerms.seller = [seller.address]
    baseTerms.appraisals = await PayloadBuilder.dataHashes(appraisals)
    baseTerms.assets = await PayloadBuilder.dataHashes(assets)

    // Configure condition for specific buyer
    CONDITION_FOR_SPECIFIC_BUYER.definition.contains.properties.buyer.items.const = buyer.address
  })
  describe('when conditions are fulfilled', () => {
    describe('returns empty array', () => {
      it.each(allConditions)('for single condition', async (rule) => {
        const conditions = [await PayloadBuilder.dataHash(rule)]
        const coupon: Coupon = { ...validCoupon, conditions }
        const terms: EscrowTerms = { ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)] }
        const payloads = [terms, coupon, rule, ...assets, ...appraisals]
        const results = await findUnfulfilledConditions(coupon, payloads)
        expect(results).toEqual([])
      })
      it('for multiple conditions', async () => {
        const conditions = await PayloadBuilder.dataHashes(allConditions)
        const coupon: Coupon = { ...validCoupon, conditions }
        const terms: EscrowTerms = { ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)] }
        const payloads = [terms, coupon, ...allConditions, ...assets, ...appraisals]
        const results = await findUnfulfilledConditions(coupon, payloads)
        expect(results).toEqual([])
      })
    })
  })
  describe('when conditions are not fulfilled', () => {
    describe('returns all unfulfilled condition hashes', () => {
      describe('for maximum appraisal amount', () => {
        const rule = CONDITION_REQUIRES_APPRAISAL_DOES_NOT_EXCEED_AMOUNT
        it('when escrow terms do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const payloads = [coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
        it('when appraisals do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], assets: [], appraisals: [],
          }
          const payloads = [terms, coupon, rule]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
        it('when appraisal price exceeds the maximum amount', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const assets = [asset1]
          const appraisal1: HashLeaseEstimate = {
            schema: HashLeaseEstimateSchema, price: 1000, currency: 'USD', exp, nbf,
          }
          const appraisals = [appraisal1]
          const terms: EscrowTerms = {
            ...baseTerms,
            discounts: [await PayloadBuilder.dataHash(coupon)],
            assets: await PayloadBuilder.dataHashes(assets),
            appraisals: await PayloadBuilder.dataHashes(appraisals),
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
      })
      describe('for minimum purchase quantity', () => {
        const rule = CONDITION_REQUIRES_BUYING_TWO
        it('when escrow terms do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const payloads = [coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
        it('when appraisals do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], assets: [], appraisals: [],
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
        it('when appraisal quantity does not exceed the required amount', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const assets = [asset1]
          const appraisals = [appraisal1]
          const terms: EscrowTerms = {
            ...baseTerms,
            discounts: [await PayloadBuilder.dataHash(coupon)],
            assets: await PayloadBuilder.dataHashes(assets),
            appraisals: await PayloadBuilder.dataHashes(appraisals),
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
      })
      describe('for specific buyer', () => {
        const rule = CONDITION_FOR_SPECIFIC_BUYER
        it('when escrow terms do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const payloads = [coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms contains no buyers', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], buyer: [],
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms buyers does not contain specified address', async () => {
          const buyer = await HDWallet.random()
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const assets = [asset1]
          const appraisals = [appraisal1]
          const terms: EscrowTerms = {
            ...baseTerms,
            discounts: [await PayloadBuilder.dataHash(coupon)],
            assets: await PayloadBuilder.dataHashes(assets),
            appraisals: await PayloadBuilder.dataHashes(appraisals),
            buyer: [buyer.address],
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, payloads)
          expect(results).toEqual(conditions)
        })
      })
    })
  })
})
