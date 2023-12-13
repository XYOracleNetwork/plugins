import { describeIf } from '@xylabs/jest-helpers'
import { EvmContractSchema } from '@xyo-network/evm-contract-witness'
import { ERC20__factory } from '@xyo-network/open-zeppelin-typechain'

import { EvmAbiImplementedDiviner, EvmAbiImplementedDivinerConfigSchema } from '../Diviner'

describeIf(process.env.INFURA_PROJECT_ID)('EvmAbiImplementedDiviner', () => {
  const cases = [
    ['0x55296f69f40ea6d20e478533c15a6b08b654e758', ERC20__factory.abi], //XYO ERC20
  ] as const
  describe('divine', () => {
    describe('with matching ABI', () => {
      it.each(cases)('returns implemented true', async (address, abi) => {
        const witness = await EvmAbiImplementedDiviner.create({
          account: 'random',
          config: { abi, schema: EvmAbiImplementedDivinerConfigSchema },
        })
        const observation = await witness.divine([{ address, block: 0, chainId: 1, code: '0x00', schema: EvmContractSchema }])
        expect(observation?.length).toBeGreaterThan(0)
        for (const obs of observation ?? []) {
          expect(obs.address).toBe(address)
          expect(obs.implemented).toBeTrue()
        }
      })
    })
    describe('without matching ABI', () => {
      it.each(cases)('returns implemented false', async (address, abi) => {
        const witness = await EvmAbiImplementedDiviner.create({
          account: 'random',
          config: { abi, schema: EvmAbiImplementedDivinerConfigSchema },
        })
        const observation = await witness.divine([{ address, block: 0, chainId: 1, code: '0x00', schema: EvmContractSchema }])
        expect(observation?.length).toBeGreaterThan(0)
        for (const obs of observation ?? []) {
          expect(obs.address).toBe(address)
          expect(obs.implemented).toBeFalse()
        }
      })
    })
  })
})
