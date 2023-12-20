import { describeIf } from '@xylabs/jest-helpers'
import { EvmContractSchema, EvmContractWitness, EvmContractWitnessConfigSchema } from '@xyo-network/evm-contract-witness'
import { EvmAddressSchema, getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'

import { EvmTokenInterfaceImplementedDiviner, EvmTokenInterfaceImplementedDivinerConfigSchema } from '../Diviner'
import { TokenInterface } from '../Payload'

describeIf(process.env.INFURA_PROJECT_ID)('EvmTokenInterfaceImplementedDiviner', () => {
  type TestData = readonly [string, TokenInterface[]]
  const cases: readonly TestData[] = [
    ['0x55296f69f40ea6d20e478533c15a6b08b654e758', ['ERC20'] as TokenInterface[]], // XYO ERC20
    ['0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', ['ERC721', 'ERC721Metadata', 'ERC721Enumerable', 'ERC721TokenReceiver'] as TokenInterface[]], // BAYC
    ['0x2A6d6a082C410a195157EC4caf67CB9fD718f087', ['ERC1155', 'ERC1155Metadata_URI', 'ERC1155TokenReceiver'] as TokenInterface[]], // Spider Tanks
  ] as const
  describe('divine', () => {
    describe('with matching ABI', () => {
      it.each(cases)('returns implemented true', async (address, tokenInterfaces) => {
        const witness = await EvmContractWitness.create({
          account: 'random',
          config: { schema: EvmContractWitnessConfigSchema },
          providers: getProvidersFromEnv,
        })
        const diviner = await EvmTokenInterfaceImplementedDiviner.create({
          account: 'random',
          config: { schema: EvmTokenInterfaceImplementedDivinerConfigSchema, tokenInterfaces },
        })
        const observations = await witness.observe([{ address, schema: EvmAddressSchema }])
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
      it.each(cases)('returns implemented false', async (address, tokenInterfaces) => {
        const diviner = await EvmTokenInterfaceImplementedDiviner.create({
          account: 'random',
          config: { schema: EvmTokenInterfaceImplementedDivinerConfigSchema, tokenInterfaces },
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
