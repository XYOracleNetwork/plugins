import { EscrowTermsFields } from './Terms.ts'

/**
 * The party's secret in an escrow transaction
 */
export type EscrowPartySecret = keyof Pick<EscrowTermsFields, 'buyerSecret' | 'sellerSecret'>
