import '@xylabs/vitest-extended'

import { EvmAddressSchema, getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import {
  describe, expect,
  it,
} from 'vitest'

import { EvmContractWitness, EvmContractWitnessConfigSchema } from '../Witness.ts'

describe.skipIf(!process.env.INFURA_PROJECT_ID)('CryptoWalletNftWitness', () => {
  const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' // XYO ERC20
  describe('observe', () => {
    it('get code from contract', async () => {
      const witness = await EvmContractWitness.create({
        account: 'random',
        config: { schema: EvmContractWitnessConfigSchema },
        providers: getProvidersFromEnv,
      })
      const observation = await witness.observe([{ address, schema: EvmAddressSchema }])
      expect(observation[0].address).toBe(address)
      expect(observation[0].code).toBeString()
      expect(observation[0].block).toBeNumber()
    })
  })
})
