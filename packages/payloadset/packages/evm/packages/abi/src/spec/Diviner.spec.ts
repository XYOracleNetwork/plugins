import { describeIf } from '@xylabs/jest-helpers'
import { EvmContractSchema, EvmContractWitness, EvmContractWitnessConfigSchema } from '@xyo-network/evm-contract-witness'
import { ERC20__factory } from '@xyo-network/open-zeppelin-typechain'
import { BlockchainAddressSchema, getProvidersFromEnv } from '@xyo-network/witness-blockchain-abstract'

import { EvmAbiImplementedDiviner, EvmAbiImplementedDivinerConfigSchema } from '../Diviner'

describeIf(process.env.INFURA_PROJECT_ID)('EvmAbiImplementedDiviner', () => {
  const cases = [
    ['0x55296f69f40ea6d20e478533c15a6b08b654e758', ERC20__factory.abi], //XYO ERC20
  ] as const
  describe('divine', () => {
    describe('with matching ABI', () => {
      it.each(cases)('returns implemented true', async (address, abi) => {
        const witness = await EvmContractWitness.create({
          account: 'random',
          config: { schema: EvmContractWitnessConfigSchema },
          providers: getProvidersFromEnv,
        })
        const diviner = await EvmAbiImplementedDiviner.create({
          account: 'random',
          config: { abi, schema: EvmAbiImplementedDivinerConfigSchema },
        })
        const observations = await witness.observe([{ address, schema: BlockchainAddressSchema }])
        expect(observations?.length).toBeGreaterThan(0)
        const code = observations?.[0].code
        const results = await diviner.divine([{ address, block: 0, chainId: 1, code, schema: EvmContractSchema }])
        expect(results?.length).toBeGreaterThan(0)
        for (const result of results ?? []) {
          expect(result.address).toBe(address)
          expect(result.implemented).toBeTrue()
        }
      })
    })
    describe('without matching ABI', () => {
      it.each(cases)('returns implemented false', async (address, abi) => {
        const diviner = await EvmAbiImplementedDiviner.create({
          account: 'random',
          config: { abi, schema: EvmAbiImplementedDivinerConfigSchema },
        })
        const results = await diviner.divine([{ address, block: 0, chainId: 1, code: '0x00', schema: EvmContractSchema }])
        expect(results?.length).toBeGreaterThan(0)
        for (const result of results ?? []) {
          expect(result.address).toBe(address)
          expect(result.implemented).toBeFalse()
        }
      })
    })
  })
})
