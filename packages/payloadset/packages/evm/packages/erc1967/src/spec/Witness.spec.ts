import '@xylabs/vitest-extended'

import { EvmAddressSchema, getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import {
  describe, expect,
  it,
} from 'vitest'

import { Erc1967Witness, Erc1967WitnessConfigSchema } from '../Witness.ts'

describe.skipIf(!process.env.INFURA_PROJECT_ID)('CryptoWalletNftWitness', () => {
  it('get code from contract (no proxy)', async () => {
    const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' // XYO ERC20
    const witness = await Erc1967Witness.create({
      account: 'random',
      config: { schema: Erc1967WitnessConfigSchema },
      providers: getProvidersFromEnv,
    })
    const observation = await witness.observe([{ address, schema: EvmAddressSchema }])
    expect(observation[0].address).toBe(address)
    expect(observation[0].slots).toBeObject()
    expect(observation[0].implementation).toBeString()
  })
  it('get code from contract (proxy)', async () => {
    const address = '0x33FD426905F149f8376e227d0C9D3340AaD17aF1' // The Memes NFT
    const witness = await Erc1967Witness.create({
      account: 'random',
      config: { schema: Erc1967WitnessConfigSchema },
      providers: getProvidersFromEnv,
    })
    const observation = await witness.observe([{ address, schema: EvmAddressSchema }])
    expect(observation[0].address).toBe(address.toLowerCase())
    expect(observation[0].slots).toBeObject()
    expect(observation[0].implementation).toBe('0x142fd5b9d67721efda3a5e2e9be47a96c9b724a4')
  })
})
