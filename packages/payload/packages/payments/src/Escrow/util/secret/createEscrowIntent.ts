import type { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { Id } from '@xyo-network/id-payload-plugin'

import type { EscrowTerms } from '../../Terms/index.ts'

/**
 * Creates an escrow intent (for a buyer or seller) using the supplied secret
 * @param terms The payload describing the terms for the escrow
 * @param secret The secret for the escrow principal party to use for the escrow
 * @param account The account to create the escrow intent with
 * @returns The escrow intent
 */
export const createEscrowIntentWithSecret = async (terms: EscrowTerms, secret: Id, account: AccountInstance) => {
  const result = await new BoundWitnessBuilder().signers([account]).payloads([terms, secret]).build()
  return result
}
