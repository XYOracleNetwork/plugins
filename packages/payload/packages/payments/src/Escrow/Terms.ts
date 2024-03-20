import { Address, Hash } from '@xylabs/hex'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { EscrowSchema } from './Schema'

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

export const isEscrowTerms = isPayloadOfSchemaType<EscrowTerms>(EscrowTermsSchema)
