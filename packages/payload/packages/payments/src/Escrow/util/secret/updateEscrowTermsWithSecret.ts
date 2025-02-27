import { AccountInstance } from '@xyo-network/account-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { IdPayload } from '@xyo-network/id-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'

import {
  EscrowParty, EscrowPartySecret, EscrowTerms,
} from '../../Terms/index.ts'
import { getEscrowSecret } from './getEscrowSecret.ts'

/**
 * Creates an escrow intent (for a buyer or seller) using the supplied secret
 * @param terms The payload describing the terms for the escrow
 * @param escrowParty The party in the escrow transaction
 * @param account The account(s) to create the escrow intent with
 * @param secret The secret for the escrow principal party to use for the escrow. If
 * not provided, a cryptographically random secret will be generated.
 * @returns The escrow intent
 */
export const updateEscrowTermsWithSecret = async (
  terms: EscrowTerms,
  escrowParty: EscrowParty,
  account: AccountInstance | AccountInstance[],
  secret?: IdPayload,
) => {
  if (!secret) secret = getEscrowSecret()
  const signers = Array.isArray(account) ? account : [account]
  // Add party addresses to escrow terms
  terms[escrowParty] = signers.map(signer => signer.address)
  // Add secret hash to terms
  const secretType: EscrowPartySecret = escrowParty === 'buyer' ? 'buyerSecret' : 'sellerSecret'
  const secretHash = await PayloadBuilder.dataHash(secret)
  terms[secretType] = secretHash
  // Have the parties sign the secret and terms
  const result = await new BoundWitnessBuilder().signers(signers).payloads([terms, secret]).build()
  return result
}
