/* eslint-disable max-statements */

import { describeIf } from '@xylabs/jest-helpers'
import {
  createProfiler, profile, profileReport,
} from '@xylabs/profile'
import { HDWallet } from '@xyo-network/account'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import {
  ERC721__factory, ERC721Enumerable__factory, ERC1155__factory,
} from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProviderFromEnv } from '@xyo-network/witness-evm-abstract'
import { asWitnessInstance } from '@xyo-network/witness-model'
import type { Provider } from 'ethers'

import type { EvmCallResults } from '../Diviner'
import { EvmCallDiviner, EvmCallResultsSchema } from '../Diviner'
import type { EvmCall } from '../Payload'
import { EvmCallSchema } from '../Payload'
import { EvmCallWitness } from '../Witness'
import erc721SentinelManifest from './Erc721Sentinel.json'

const profiler = createProfiler()

const tokenCount = 0
const maxProviders = 2

describe('Erc721Sentinel - Collection', () => {
  // const address = '0x562fC2927c77cB975680088566ADa1dC6cB8b5Ea' //Random ERC721
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' // Bored Apes
  // const address = '0x495f947276749Ce646f68AC8c248420045cb7b5e' //OpenSea Storefront
  // const address = '0x6802df79bcbbf019fe5cb366ff25720d1365cfd3' //Upgradeable

  const getProviders = () => {
    const providers: Provider[] = []
    for (let i = 0; i < maxProviders; i++) {
      providers.push(getProviderFromEnv(1))
    }
    return providers
  }

  const providers = getProviders()

  describeIf(providers)('report', () => {
    it('specifying address', async () => {
      profile(profiler, 'setup')
      const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
      const wallet = await HDWallet.fromPhrase(mnemonic)
      const locator = new ModuleFactoryLocator()
      locator.register(EvmCallDiviner)

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721__factory.abi },
          providers: () => getProviders(),
        }),
        { 'network.xyo.evm.interface': 'Erc721' },
      )

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721Enumerable__factory.abi },
          providers: () => getProviders(),
        }),
        { 'network.xyo.evm.interface': 'Erc721Enumerable' },
      )

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC1155__factory.abi },
          providers: () => getProviders(),
        }),
        { 'network.xyo.evm.interface': 'Erc1155' },
      )
      profile(profiler, 'setup')
      profile(profiler, 'manifest')
      const manifest = new ManifestWrapper(erc721SentinelManifest as PackageManifestPayload, wallet, locator)
      profile(profiler, 'manifest-load')
      const node = await manifest.loadNodeFromIndex(0)
      profile(profiler, 'manifest-load')
      profile(profiler, 'manifest-resolve')
      const mods = await node.resolve('*')
      profile(profiler, 'manifest-resolve')
      profile(profiler, 'manifest')
      expect(mods.length).toBeGreaterThan(5)

      const collectionSentinel = asSentinelInstance(await node.resolve('NftInfoSentinel'))
      expect(collectionSentinel).toBeDefined()

      const nameWitness = asWitnessInstance(await node.resolve('Erc721NameWitness'))
      expect(nameWitness).toBeDefined()

      const symbolWitness = asWitnessInstance(await node.resolve('Erc721SymbolWitness'))
      expect(symbolWitness).toBeDefined()

      const diviner = asDivinerInstance(await node.resolve('ContractInfoDiviner'))
      expect(diviner).toBeDefined()

      const collectionCallPayload: EvmCall = { address, schema: EvmCallSchema }
      profile(profiler, 'collectionReport')
      const report = await collectionSentinel?.report([collectionCallPayload])
      profile(profiler, 'collectionReport')
      profile(profiler, 'tokenCallSetup')
      const info = report?.find(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults | undefined
      console.log(`info: ${JSON.stringify(info, null, 2)}`)

      expect(info?.results?.name.result).toBeString()
    })
    afterAll(() => {
      const profileData = profileReport(profiler)
      if (profileData['tokenReport']) console.log(`Timer: ${profileData['tokenReport'] / tokenCount}ms`)
      console.log(`Profile: ${JSON.stringify(profileData, null, 2)}`)
    })
  })
})
