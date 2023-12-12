import { describeIf } from '@xylabs/jest-helpers'
import { EvmContractSchema } from '@xyo-network/evm-contract-witness'
import { getProvidersFromEnv } from '@xyo-network/witness-blockchain-abstract'

import { EvmAbiImplementedWitness, EvmAbiImplementedWitnessConfigSchema } from '../Witness'

describeIf(process.env.INFURA_PROJECT_ID)('CryptoWalletNftWitness', () => {
  const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' //XYO ERC20
  describe('observe', () => {
    it('get code from contract', async () => {
      const witness = await EvmAbiImplementedWitness.create({
        account: 'random',
        config: { abi: [], schema: EvmAbiImplementedWitnessConfigSchema },
        providers: getProvidersFromEnv,
      })
      const observation = await witness.observe([{ address, block: 0, chainId: 1, code: '0x00', schema: EvmContractSchema }])
      expect(observation[0].address).toBe(address)
    })
  })
})
