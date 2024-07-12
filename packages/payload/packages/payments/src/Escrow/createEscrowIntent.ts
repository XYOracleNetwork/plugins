import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { IdPayload } from '@xyo-network/id-payload-plugin'

import { EscrowTerms } from './Terms.js'

/**
 * Creates an escrow intent
 * @deprecated Use createEscrowIntentWithSecret instead
 * @param terms The payloads describing the terms for the escrow
 * @param account The account to create the escrow intent with
 * @returns The escrow intent
 */
export const createEscrowIntent = async (terms: EscrowTerms[], account: AccountInstance) => {
  const result = await new BoundWitnessBuilder({ accounts: [account] }).payloads([...terms]).build()
  return result
}

/**
 * Creates an escrow intent (for a buyer or seller) using the supplied secret
 * @param terms The payload describing the terms for the escrow
 * @param secret The secret for the escrow principal party to use for the escrow
 * @param account The account to create the escrow intent with
 * @returns The escrow intent
 */
export const createEscrowIntentWithSecret = async (terms: EscrowTerms, secret: IdPayload, account: AccountInstance) => {
  const result = await new BoundWitnessBuilder({ accounts: [account] }).payloads([terms, secret]).build()
  return result
}
