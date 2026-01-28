import type { Address, Hash } from '@xylabs/hex'
import { AsObjectFactory } from '@xylabs/object'
import type { Payload } from '@xyo-network/payload-model'
import {
  asSchema, isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { EscrowSchema } from '../Schema.ts'

export const EscrowTermsSchema = asSchema(`${EscrowSchema}.terms`, true)
export type EscrowTermsSchema = typeof EscrowTermsSchema

// TODO: Include escrow agent in escrow terms
export interface EscrowTermsFields {
  /**
   * The trusted estimators for the worth of the things being sold
   */
  appraisalAuthorities: Address[]
  /**
   * The estimated worths of the things being sold
   */
  appraisals: Hash[]
  /**
   * The things being sold
   */
  assets: Hash[]
  /**
   * The buyer
   */
  buyer: Address[]
  /**
   * The buyer
   */
  buyerSecret: Hash
  /**
   * Any discounts (coupons, vouchers, credits, etc.) to be applied to the escrow
   */
  discounts: Hash[]
  /**
   * The escrow agent responsible for the escrow
   */
  escrowAgent: Address
  /**
   * The time the escrow expires
   */
  exp: number
  /**
   * The time the escrow starts
   */
  nbf: number
  /**
   * The trusted payment authorities
   */
  paymentAuthorities: Address[]
  /**
   * The seller
   */
  seller: Address[]
  /**
   * The seller
   */
  sellerSecret: Hash
}

/**
 * The terms of an escrow
 */
export type EscrowTerms = Payload<Partial<EscrowTermsFields>, EscrowTermsSchema>

/**
 * Identity function for determining if an object is an EscrowTerms
 */
export const isEscrowTerms = isPayloadOfSchemaType<EscrowTerms>(EscrowTermsSchema)
export const asEscrowTerms = AsObjectFactory.create<EscrowTerms>(isEscrowTerms)
export const asOptionalEscrowTerms = AsObjectFactory.createOptional<EscrowTerms>(isEscrowTerms)

/**
 * Identity function for determining if an object is an EscrowTerms with sources
 */
export const isEscrowTermsWithSources = isPayloadOfSchemaTypeWithSources<EscrowTerms>(EscrowTermsSchema)
export const asEscrowTermsWithSources = AsObjectFactory.create<EscrowTerms>(isEscrowTermsWithSources)
export const asOptionalEscrowTermsWithSources = AsObjectFactory.createOptional<EscrowTerms>(isEscrowTermsWithSources)
