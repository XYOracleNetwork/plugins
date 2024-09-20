/* eslint-disable max-nested-callbacks */
import { HDWallet } from '@xyo-network/account'
import type { AccountInstance } from '@xyo-network/account-model'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Id } from '@xyo-network/id-payload-plugin'
import { IdSchema } from '@xyo-network/id-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'

import type { EscrowParty, EscrowTerms } from '../../../../Terms/index.ts'
import { EscrowTermsSchema } from '../../../../Terms/index.ts'
import { createEscrowIntentWithSecret } from '../../../../util/index.ts'
import { getPartySecretSignedValidator } from '../getPartySecretSignedValidator.ts'

describe('RegistrarSentinel', () => {
  let buyer: AccountInstance
  let seller: AccountInstance
  const baseTerms: EscrowTerms = { schema: EscrowTermsSchema }
  const buyerSecret: Id = { schema: IdSchema, salt: `${Date.now() - 10}` }
  let buyerSecretSignature: BoundWitness
  const sellerSecret: Id = { schema: IdSchema, salt: `${Date.now() + 10}` }
  let sellerSecretSignature: BoundWitness

  describe('getPartySecretSignedValidator', () => {
    beforeAll(async () => {
      buyer = await HDWallet.random()
      seller = await HDWallet.random()

      baseTerms.buyer = [buyer.address]
      baseTerms.buyerSecret = await PayloadBuilder.dataHash(buyerSecret)
      baseTerms.seller = [seller.address]
      baseTerms.sellerSecret = await PayloadBuilder.dataHash(sellerSecret)

      const buyerIntent = await createEscrowIntentWithSecret(baseTerms, buyerSecret, buyer)
      const sellerIntent = await createEscrowIntentWithSecret(baseTerms, sellerSecret, seller)

      buyerSecretSignature = buyerIntent[0]
      sellerSecretSignature = sellerIntent[0]
    })
    const cases: EscrowParty[] = ['buyer', 'seller']
    describe.each(cases)('for %s', (party) => {
      describe('returns true', () => {
        it('with valid escrow terms and values supplied', async () => {
          const payloads = party === 'buyer' ? [baseTerms, buyerSecret, buyerSecretSignature] : [baseTerms, sellerSecret, sellerSecretSignature]
          const dictionary = await PayloadBuilder.toAllHashMap(payloads)
          const partySecretValidator = getPartySecretSignedValidator(dictionary, party)
          const result = await partySecretValidator(baseTerms)
          expect(result).toBeTrue()
        })
      })
      describe('returns false', () => {
        describe('with invalid escrow terms value for', () => {
          describe('secret', () => {
            it('undefined', async () => {
              const terms = { ...baseTerms, [`${party}Secret`]: undefined }
              const payloads = party === 'buyer' ? [terms, buyerSecret, buyerSecretSignature] : [terms, sellerSecret, sellerSecretSignature]
              const dictionary = await PayloadBuilder.toAllHashMap(payloads)
              const partySecretValidator = getPartySecretSignedValidator(dictionary, party)
              const result = await partySecretValidator(terms)
              expect(result).toBeFalse()
            })
            it('different from signature', async () => {
              const secret: Id = { schema: IdSchema, salt: '0' }
              const terms = { ...baseTerms, [`${party}Secret`]: await PayloadBuilder.dataHash(secret) }
              const payloads = party === 'buyer' ? [terms, buyerSecret, buyerSecretSignature] : [terms, sellerSecret, sellerSecretSignature]
              const dictionary = await PayloadBuilder.toAllHashMap(payloads)
              const partySecretValidator = getPartySecretSignedValidator(dictionary, party)
              const result = await partySecretValidator(terms)
              expect(result).toBeFalse()
            })
          })
        })
        describe('with missing value for', () => {
          it('boundwitness', async () => {
            const payloads: Payload[] = party === 'buyer' ? [baseTerms, buyerSecret] : [baseTerms, sellerSecret]
            const dictionary = await PayloadBuilder.toAllHashMap(payloads)
            const partySecretValidator = getPartySecretSignedValidator(dictionary, party)
            const result = await partySecretValidator(baseTerms)
            expect(result).toBeFalse()
          })
        })
      })
    })
  })
})
