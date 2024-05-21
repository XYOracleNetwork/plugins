import { Hash } from '@xylabs/hex'
import { HDWallet, WalletInstance } from '@xyo-network/account'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { BoundWitness } from '@xyo-network/boundwitness-model'
import { Payload } from '@xyo-network/payload-model'

import { DurationFields } from '../../Duration'
import { validateBoundWitnessWithDuration } from '../validateBoundWitnessWithDuration'

describe('validateBoundWitnessWithDuration', () => {
  let nameserver: WalletInstance
  let domainOwner: WalletInstance
  let recordBw: BoundWitness
  let recordPayload: Payload<DurationFields>
  const schema = 'network.xyo.test'
  beforeAll(async () => {
    nameserver = await HDWallet.fromPhrase('camp notable brick vast absent express leader safe obey crater yard gun multiply crouch devote')
    domainOwner = await HDWallet.fromPhrase('carbon donate rib engage earth vibrant cover fruit way hair poverty grunt fish husband initial')
    const delegation = {
      domain: 'foo.xyo',
      exp: Date.now() + 1_000_000,
      nameserver: nameserver.address,
      nbf: Date.now(),
      schema,
    }
    const [bw] = await new BoundWitnessBuilder().payload(delegation).signer(domainOwner).build()
    recordBw = bw
    recordPayload = delegation
  })
  describe('returns true', () => {
    it('with valid boundwitness', async () => {
      expect(await validateBoundWitnessWithDuration(recordBw, recordPayload)).toBeTrue()
    })
  })
  describe('returns false', () => {
    it('with invalid boundwitness', async () => {
      const invalidHash: Hash = '0440a9ee15736ba6e6618083da25a57f5e9d8a516e61b9b2ae330f050f88f2de'
      const payload_hashes = [invalidHash]
      const invalid = { ...recordBw, payload_hashes }
      expect(await validateBoundWitnessWithDuration(invalid, recordPayload)).toBeFalse()
    })
    it('with invalid payload', async () => {
      const invalidPayload = {
        domain: 'foo.xyo',
        exp: Date.now() - 10_000,
        nameserver: 'not_a_valid_address',
        nbf: Date.now() + 10_000,
        schema,
      } as Payload<DurationFields>
      const [bw] = await new BoundWitnessBuilder().payload(invalidPayload).signer(domainOwner).build()
      expect(await validateBoundWitnessWithDuration(bw, invalidPayload)).toBeFalse()
    })
  })
})
