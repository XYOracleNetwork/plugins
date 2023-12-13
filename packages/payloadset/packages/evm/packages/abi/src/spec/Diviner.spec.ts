import { describeIf } from '@xylabs/jest-helpers'
import { EvmContractSchema } from '@xyo-network/evm-contract-witness'
import { ERC20__factory } from '@xyo-network/open-zeppelin-typechain'

import { EvmAbiImplementedDiviner, EvmAbiImplementedDivinerConfigSchema } from '../Diviner'

describeIf(process.env.INFURA_PROJECT_ID)('EvmAbiImplementedDiviner', () => {
  const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' //XYO ERC20
  describe('divine', () => {
    describe('with matching ABI', () => {
      it('get code from contract', async () => {
        const witness = await EvmAbiImplementedDiviner.create({
          account: 'random',
          config: { abi: ERC20__factory.abi, schema: EvmAbiImplementedDivinerConfigSchema },
        })
        const observation = await witness.divine([{ address, block: 0, chainId: 1, code: '0x00', schema: EvmContractSchema }])
        expect(observation[0].address).toBe(address)
      })
    })
  })
})
