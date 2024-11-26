import '@xylabs/vitest-extended'

import type { Hash } from '@xylabs/hex'
import type { WalletInstance } from '@xyo-network/account'
import { HDWallet } from '@xyo-network/account'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import type { DurationFields } from '../../Duration.ts'
import { validateBoundWitnessAndDuration } from '../validateBoundWitnessAndDuration.ts'

describe('validateBoundWitnessAndDuration', () => {
  let nameServer: WalletInstance
  let domainOwner: WalletInstance
  let recordBw: BoundWitness
  let recordPayload: Payload<DurationFields>
  const schema = 'network.xyo.test'
  beforeAll(async () => {
    nameServer = await HDWallet.fromPhrase('camp notable brick vast absent express leader safe obey crater yard gun multiply crouch devote')
    domainOwner = await HDWallet.fromPhrase('carbon donate rib engage earth vibrant cover fruit way hair poverty grunt fish husband initial')
    const delegation = {
      domain: 'foo.xyo',
      exp: Date.now() + 1_000_000,
      nameServer: nameServer.address,
      nbf: Date.now(),
      schema,
    }
    const [bw] = await new BoundWitnessBuilder().payload(delegation).signer(domainOwner).build()
    recordBw = bw
    recordPayload = delegation
  })
  describe('returns true', () => {
    it('with valid boundwitness', async () => {
      expect(await validateBoundWitnessAndDuration(recordBw, recordPayload)).toBeTrue()
    })
  })
  describe('returns false', () => {
    it('with invalid boundwitness', async () => {
      const invalidHash: Hash = '0440a9ee15736ba6e6618083da25a57f5e9d8a516e61b9b2ae330f050f88f2de'
      const payload_hashes = [invalidHash]
      const invalid = { ...recordBw, payload_hashes }
      expect(await validateBoundWitnessAndDuration(invalid, recordPayload)).toBeFalse()
    })
  })
})
