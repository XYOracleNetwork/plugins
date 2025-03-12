import type { EscrowTermsFields } from './Terms.ts'

/**
 * The party in an escrow transaction
 */
export type EscrowParty = keyof Pick<EscrowTermsFields, 'buyer' | 'seller'>
