import type { Address } from '@xylabs/hex'
import type { WalletInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import { type HashLeaseEstimate, HashLeaseEstimateSchema } from '@xyo-network/diviner-hash-lease'
import type { IdPayload } from '@xyo-network/id-payload-plugin'
import { IdSchema } from '@xyo-network/id-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type {
  BuyerCondition,
  Condition, Coupon, EscrowTerms,
} from '@xyo-network/payment-payload-plugins'
import {
  createConditionForMaximumAppraisalAmount,
  createConditionForMinimumAssetQuantity, createConditionForRequiredBuyer, EscrowTermsSchema, FixedAmountCouponSchema,
} from '@xyo-network/payment-payload-plugins'
import type { SchemaPayload } from '@xyo-network/schema-payload-plugin'
import {
  beforeEach, describe, expect,
  it,
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
  const CONDITION_REQUIRES_BUYING_TWO: Condition = createConditionForMinimumAssetQuantity(2)
  const CONDITION_REQUIRES_APPRAISAL_DOES_NOT_EXCEED_AMOUNT: Condition = createConditionForMaximumAppraisalAmount(20)
  const CONDITION_FOR_SPECIFIC_BUYER: BuyerCondition = createConditionForRequiredBuyer('TODO: Replace in beforeAll' as Address)

  const allConditions: SchemaPayload[] = [
    CONDITION_REQUIRES_BUYING_TWO,
    CONDITION_REQUIRES_APPRAISAL_DOES_NOT_EXCEED_AMOUNT,
    CONDITION_FOR_SPECIFIC_BUYER,
  ]

  let buyer: WalletInstance
  let seller: WalletInstance
  const baseTerms: EscrowTerms = {
    schema: EscrowTermsSchema, appraisals: [], exp, nbf,
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
  describe('when all conditions are fulfilled', () => {
    describe('returns empty array', () => {
      it.each(allConditions)('for single condition', async (rule) => {
        const conditions = [await PayloadBuilder.dataHash(rule)]
        const coupon: Coupon = { ...validCoupon, conditions }
        const terms: EscrowTerms = { ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)] }
        const payloads = [terms, coupon, rule, ...assets, ...appraisals]
        const results = await findUnfulfilledConditions(coupon, [rule], payloads)
        expect(results).toEqual([])
      })
      it('for multiple conditions', async () => {
        const conditions = await PayloadBuilder.dataHashes(allConditions)
        const coupon: Coupon = { ...validCoupon, conditions }
        const terms: EscrowTerms = { ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)] }
        const payloads = [terms, coupon, ...allConditions, ...assets, ...appraisals]
        const results = await findUnfulfilledConditions(coupon, allConditions, payloads)
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
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms appraisals do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], appraisals: undefined,
          }
          const payloads = [terms, coupon, rule, ...appraisals, ...assets]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms appraisals is empty', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], appraisals: [],
          }
          const payloads = [terms, coupon, rule, ...appraisals, ...assets]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when appraisals not supplied', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = { ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)] }
          const payloads = [terms, coupon, rule, ...assets]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when supplied appraisal price exceeds the maximum amount', async () => {
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
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
      })
      describe('for minimum purchase quantity', () => {
        const rule = CONDITION_REQUIRES_BUYING_TWO
        it('when escrow terms do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const payloads = [coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms assets do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], assets: undefined,
          }
          const payloads = [terms, coupon, rule, ...appraisals, ...assets]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms assets is empty', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], assets: [],
          }
          const payloads = [terms, coupon, rule, ...appraisals, ...assets]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms assets quantity does not exceed the required amount', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const assets = [asset1]
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], assets: await PayloadBuilder.dataHashes(assets),
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
      })
      describe('for specific buyer', () => {
        const rule = CONDITION_FOR_SPECIFIC_BUYER
        it('when escrow terms do not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const payloads = [coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms buyer does not exist', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], buyer: undefined,
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms buyers is empty', async () => {
          const conditions = [await PayloadBuilder.dataHash(rule)]
          const coupon: Coupon = { ...validCoupon, conditions }
          const terms: EscrowTerms = {
            ...baseTerms, discounts: [await PayloadBuilder.dataHash(coupon)], buyer: [],
          }
          const payloads = [terms, coupon, rule, ...assets, ...appraisals]
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
        it('when escrow terms buyer does not contain specified address', async () => {
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
          const results = await findUnfulfilledConditions(coupon, [rule], payloads)
          expect(results).toEqual(conditions)
        })
      })
    })
  })
})
