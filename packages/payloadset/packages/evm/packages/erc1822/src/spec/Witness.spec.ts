import { describeIf } from '@xylabs/jest-helpers'
import { EvmAddressSchema, getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'

import { Erc1822Witness, Erc1822WitnessConfigSchema } from '../Witness'

describeIf(process.env.INFURA_PROJECT_ID)('CryptoWalletNftWitness', () => {
  const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' // XYO ERC20
  describe('observe', () => {
    it('get code from contract', async () => {
      const witness = await Erc1822Witness.create({
        account: 'random',
        config: { schema: Erc1822WitnessConfigSchema },
        providers: getProvidersFromEnv,
      })
      const observation = await witness.observe([{ address, schema: EvmAddressSchema }])
      expect(observation[0].address).toBe(address)
      expect(observation[0].slots).toBeObject()
      expect(observation[0].implementation).toBeString()
    })
  })
})
