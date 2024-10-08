import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { Address, Hash } from '@xylabs/hex'
import { ArchivistInstance, asArchivistInstance } from '@xyo-network/archivist-model'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { BoundWitnessDivinerQueryPayload, BoundWitnessDivinerQuerySchema } from '@xyo-network/diviner-boundwitness-model'
import {
  HashLeaseEstimate,
  isHashLeaseEstimate,
} from '@xyo-network/diviner-hash-lease'
import {
  asDivinerInstance, DivinerInstance, DivinerModuleEventData,
} from '@xyo-network/diviner-model'
import { creatableModule } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'
import {
  Condition,
  Coupon,
  Discount,
  EscrowTerms, isConditionWithMeta, isCoupon,
  isCouponWithMeta,
  isEscrowTerms, NO_DISCOUNT, PaymentDiscountDivinerConfigSchema, PaymentDiscountDivinerParams,
} from '@xyo-network/payment-payload-plugins'

import { applyCoupons, areConditionsFulfilled } from './lib/index.ts'

const DEFAULT_BOUND_WITNESS_DIVINER_QUERY_PROPS: Readonly<BoundWitnessDivinerQueryPayload> = {
  limit: 1,
  order: 'desc',
  schema: BoundWitnessDivinerQuerySchema,
}

export type PaymentDiscountDivinerInputType = EscrowTerms | Coupon | HashLeaseEstimate | Payload

@creatableModule()
export class PaymentDiscountDiviner<
  TParams extends PaymentDiscountDivinerParams = PaymentDiscountDivinerParams,
  TIn extends PaymentDiscountDivinerInputType = PaymentDiscountDivinerInputType,
  TOut extends Discount = Discount,
  TEventData extends DivinerModuleEventData<DivinerInstance<TParams, TIn, TOut>, TIn, TOut> = DivinerModuleEventData<
    DivinerInstance<TParams, TIn, TOut>,
    TIn,
    TOut
  >,
> extends AbstractDiviner<TParams, TIn, TOut, TEventData> {
  static override configSchemas = [PaymentDiscountDivinerConfigSchema]
  static override defaultConfigSchema = PaymentDiscountDivinerConfigSchema

  protected get couponAuthorities(): Address[] {
    return [...(this.config.couponAuthorities ?? []), ...(this.params.couponAuthorities ?? [])]
  }

  protected async divineHandler(payloads: TIn[] = []): Promise<TOut[]> {
    const sources: Hash[] = []

    // Parse terms
    const terms = payloads.find(isEscrowTerms) as EscrowTerms | undefined
    if (!terms) return [{ ...NO_DISCOUNT, sources }] as TOut[]
    sources.push(await PayloadBuilder.hash(terms))

    // Parse appraisals
    const termsAppraisals = terms?.appraisals
    // If the escrow terms do not have appraisals, return no discount
    if (!termsAppraisals || termsAppraisals.length === 0) return [{ ...NO_DISCOUNT, sources }] as TOut[]
    const hashMap = await PayloadBuilder.toAllHashMap(payloads) as Record<Hash, Payload>
    const appraisals = this.getEscrowAppraisals(terms, hashMap)
    // Add the appraisals that were found to the sources
    sources.push(...termsAppraisals)
    // If not all appraisals are found, return no discount
    if (appraisals.length !== termsAppraisals.length) return [{ ...NO_DISCOUNT, sources }] as TOut[]

    // Parse coupons
    const [coupons, conditions] = await this.getEscrowDiscounts(terms, hashMap)
    // Add the coupons that were found to the sources
    // NOTE: Should we throw if not all coupons are found?
    const couponHashes = await PayloadBuilder.hashes(coupons)
    sources.push(...couponHashes)

    const currentCoupons = coupons.filter(this.isCouponCurrent)
    const conditionsMetCoupons = (
      await Promise.all(currentCoupons.map(async coupon => await areConditionsFulfilled(coupon, conditions, payloads) ? coupon : undefined))).filter(exists)

    const validCoupons = await this.filterToSigned(conditionsMetCoupons)
    // NOTE: Should we throw if not all coupons are valid?
    if (validCoupons.length === 0) return [{ ...NO_DISCOUNT, sources }] as TOut[]

    // TODO: Call paymentSubtotalDiviner to get the subtotal to centralize the logic
    const discount = applyCoupons(appraisals, validCoupons)
    return [{ ...discount, sources }] as TOut[]
  }

  /**
   * Filters the supplied list of coupons to only those that are signed by
   * addresses specified in the couponAuthorities
   * @param coupons The list of coupons to filter
   * @returns The filtered list of coupons that are signed by the couponAuthorities
   */
  protected async filterToSigned(coupons: Coupon[]): Promise<Coupon[]> {
    const signed: Coupon[] = []
    const dataHashMap = await PayloadBuilder.toDataHashMap(coupons)
    const boundWitnessDiviner = await this.getDiscountsBoundWitnessDiviner()
    const hashes = Object.keys(dataHashMap)
    const addresses = this.couponAuthorities
    // TODO: Keep an in memory cache of the hashes queried and their results
    // to avoid querying the same hash multiple times
    await Promise.all(hashes.map((h) => {
      const hash = h as Hash
      return Promise.all(addresses.map(async (address) => {
        const query: BoundWitnessDivinerQueryPayload = {
          ...DEFAULT_BOUND_WITNESS_DIVINER_QUERY_PROPS, addresses: [address], payload_hashes: [hash],
        }
        const result = await boundWitnessDiviner.divine([query])
        if (result.length > 0) signed.push(dataHashMap[hash])
      }))
    }))
    return signed
  }

  protected async getDiscountsArchivist(): Promise<ArchivistInstance> {
    const name = assertEx(this.config.archivist, () => 'Missing archivist in config')
    const mod = assertEx(await this.resolve(name), () => `Error resolving archivist: ${name}`)
    return assertEx(asArchivistInstance(mod), () => `Resolved module ${mod.address} not a valid Archivist`)
  }

  protected async getDiscountsBoundWitnessDiviner(): Promise<DivinerInstance> {
    const name = assertEx(this.config.boundWitnessDiviner, () => 'Missing boundWitnessDiviner in config')
    const mod = assertEx(await this.resolve(name), () => `Error resolving boundWitnessDiviner: ${name}`)
    return assertEx(asDivinerInstance(mod), () => `Resolved module ${mod.address} not a valid Diviner`)
  }

  /**
   * Finds the appraisals specified by the escrow terms from the supplied payloads
   * @param terms The escrow terms
   * @param payloads The payloads to search for the appraisals
   * @returns The appraisals found in the payloads
   */
  protected getEscrowAppraisals(terms: EscrowTerms, hashMap: Record<Hash, Payload>): HashLeaseEstimate[] {
    const hashes = terms?.appraisals ?? []
    if (hashes.length === 0) return []
    return hashes.map(hash => hashMap[hash]).filter(exists).filter(isHashLeaseEstimate)
  }

  /**
   * Finds the discounts specified by the escrow terms from the supplied payloads
   * @param terms The escrow terms
   * @param hashMap The payloads to search for the discounts
   * @returns A tuple containing all the escrow coupons and conditions referenced in those coupons
   * that were found in the either the supplied payloads or the archivist
   */
  protected async getEscrowDiscounts(terms: EscrowTerms, hashMap: Record<Hash, Payload>): Promise<[Coupon[], Condition[]]> {
    // Parse discounts
    const discountsHashes = terms.discounts ?? []
    if (discountsHashes.length === 0) return [[], []]

    // Use the supplied payloads to find the discounts
    const discounts: Coupon[] = discountsHashes.map(hash => hashMap[hash]).filter(exists).filter(isCoupon)
    const missingDiscounts = discountsHashes.filter(hash => !hashMap[hash])
    // If not all discounts are found
    if (missingDiscounts.length > 0) {
      // Find any remaining from discounts archivist
      const discountsArchivist = await this.getDiscountsArchivist()
      const payloads = await discountsArchivist.get(missingDiscounts)
      discounts.push(...payloads.filter(isCouponWithMeta))
    }
    // If not all discounts are found
    if (discounts.length !== discountsHashes.length) {
      const termsHash = await PayloadBuilder.hash(terms)
      const foundHashes = await PayloadBuilder.hashes(discounts)
      // Log individual discounts that were not found
      for (const hash of discountsHashes) {
        if (!foundHashes.includes(hash)) console.warn(`Discount ${hash} not found for terms ${termsHash}`)
      }
    }

    const conditionsHashes: Hash[] = discounts.flatMap(discount => discount.conditions ?? [])
    const conditions: Condition[] = conditionsHashes.map(hash => hashMap[hash]).filter(exists).filter(isConditionWithMeta)
    const missingConditions = conditionsHashes.filter(hash => !hashMap[hash])

    // If not all conditions are found
    if (missingConditions.length > 0) {
      // Find any remaining from discounts archivist
      const discountsArchivist = await this.getDiscountsArchivist()
      const payloads = await discountsArchivist.get(missingConditions)
      conditions.push(...payloads.filter(isConditionWithMeta))
    }
    // If not all conditions are found
    if (conditions.length !== conditionsHashes.length) {
      const termsHash = await PayloadBuilder.hash(terms)
      const foundHashes = await PayloadBuilder.hashes(conditions)
      // Log individual conditions that were not found
      for (const hash of discountsHashes) {
        if (!foundHashes.includes(hash)) console.warn(`Coupon condition ${hash} not found for terms ${termsHash}`)
      }
    }

    return [discounts, conditions]
  }

  protected isCouponCurrent(coupon: Coupon): boolean {
    const now = Date.now()
    return coupon.exp > now && coupon.nbf < now
  }
}
