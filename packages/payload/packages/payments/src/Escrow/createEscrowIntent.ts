import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'

import { EscrowTerms } from './Terms'

/**
 * Creates an escrow intent
 * @param terms The payloads describing the terms for the escrow
 * @param account The account to create the escrow intent with
 * @returns The escrow intent
 */
export const createEscrowIntent = async (terms: EscrowTerms[], account: AccountInstance) => {
  const result = await new BoundWitnessBuilder({ accounts: [account] }).payloads([...terms]).build()
  return result
}
