import type { Address, Hash } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { EscrowSchema } from '../Schema.ts'

export const EscrowTermsSchema = `${EscrowSchema}.terms` as const
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
 * The party in an escrow transaction
 */
export type EscrowParty = keyof Pick<EscrowTermsFields, 'buyer' | 'seller'>

/**
 * The party's secret in an escrow transaction
 */
export type EscrowPartySecret = keyof Pick<EscrowTermsFields, 'buyerSecret' | 'sellerSecret'>

/**
 * The terms of an escrow
 */
export type EscrowTerms = Payload<Partial<EscrowTermsFields>, EscrowTermsSchema>

/**
 * Identity function for determining if an object is an EscrowTerms
 */
export const isEscrowTerms = isPayloadOfSchemaType<EscrowTerms>(EscrowTermsSchema)

/**
 * Identity function for determining if an object is an EscrowTerms with sources
 */
export const isEscrowTermsWithSources = isPayloadOfSchemaTypeWithSources<EscrowTerms>(EscrowTermsSchema)

/**
 * Identity function for determining if an object is an EscrowTerms with meta
 */
export const isEscrowTermsWithMeta = isPayloadOfSchemaTypeWithMeta<EscrowTerms>(EscrowTermsSchema)
