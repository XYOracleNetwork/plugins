/* eslint-disable max-statements */

import { describeIf } from '@xylabs/jest-helpers'
import { createProfiler, profile, profileReport } from '@xylabs/profile'
import { HDWallet } from '@xyo-network/account'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch-memory'
import { JsonPathAggregateDiviner } from '@xyo-network/diviner-jsonpath-aggregate-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { RangeDiviner } from '@xyo-network/diviner-range'
import { Erc1822Witness } from '@xyo-network/erc1822-witness'
import { Erc1967Witness } from '@xyo-network/erc1967-witness'
import { EvmContractWitness } from '@xyo-network/evm-contract-witness'
import { EvmTokenInterfaceImplementedDiviner } from '@xyo-network/evm-token-interface-diviner'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { ERC721__factory, ERC721Enumerable__factory, ERC721URIStorage__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { BlockchainAddress, BlockchainAddressSchema, getProvidersFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { asWitnessInstance } from '@xyo-network/witness-model'

import { EvmCallDiviner } from '../Diviner'
import { EvmCallWitness } from '../Witness'
import erc721TokenEnumerateSentinelManifest from './Erc721TokenEnumerateSentinel.json'

const profiler = createProfiler()

const tokenCount = 0
const maxProviders = 2

describe('Erc721Sentinel-Enumerate', () => {
  //const address = '0x562fC2927c77cB975680088566ADa1dC6cB8b5Ea' //Random ERC721
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' //Bored Apes
  //const address = '0x495f947276749Ce646f68AC8c248420045cb7b5e' //OpenSea Storefront
  //const address = '0x6802df79bcbbf019fe5cb366ff25720d1365cfd3' //Upgradeable

  const providers = getProvidersFromEnv(maxProviders)

  describeIf(providers.length)('report', () => {
    it('specifying address', async () => {
      profile(profiler, 'setup')
      const wallet = await HDWallet.random()
      const locator = new ModuleFactoryLocator()
      locator.register(EvmCallDiviner)
      locator.register(
        new ModuleFactory(Erc1822Witness, {
          providers: () => getProvidersFromEnv(maxProviders),
        }),
      )
      locator.register(
        new ModuleFactory(Erc1967Witness, {
          providers: () => getProvidersFromEnv(maxProviders),
        }),
      )
      locator.register(JsonPathAggregateDiviner)
      locator.register(JsonPatchDiviner)
      locator.register(
        new ModuleFactory(EvmContractWitness, {
          providers: () => getProvidersFromEnv(maxProviders),
        }),
      )
      locator.register(EvmTokenInterfaceImplementedDiviner)
      locator.register(RangeDiviner)

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721__factory.abi },
          providers: () => getProvidersFromEnv(maxProviders),
        }),
        { 'network.xyo.evm.interface': 'Erc721' },
      )

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721Enumerable__factory.abi },
          providers: () => getProvidersFromEnv(maxProviders),
        }),
        { 'network.xyo.evm.interface': 'Erc721Enumerable' },
      )

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721URIStorage__factory.abi },
          providers: () => getProvidersFromEnv(maxProviders),
        }),
        { 'network.xyo.evm.interface': 'Erc721UriStorage' },
      )

      profile(profiler, 'setup')
      profile(profiler, 'manifest')
      const manifest = new ManifestWrapper(erc721TokenEnumerateSentinelManifest as PackageManifestPayload, wallet, locator)
      profile(profiler, 'manifest-load')
      const node = await manifest.loadNodeFromIndex(0)
      profile(profiler, 'manifest-load')
      profile(profiler, 'manifest-resolve')
      const mods = await node.resolve()
      profile(profiler, 'manifest-resolve')
      profile(profiler, 'manifest')
      expect(mods.length).toBeGreaterThan(5)

      const tokenSentinel = asSentinelInstance(await node.resolve('NftTokenInfoAllSentinelDebug'))
      expect(tokenSentinel).toBeDefined()

      const tokenUriWitness = asWitnessInstance(await node.resolve('Erc721TokenURIWitness'))
      expect(tokenUriWitness).toBeDefined()

      const ownerOfWitness = asWitnessInstance(await node.resolve('Erc721OwnerOfWitness'))
      expect(ownerOfWitness).toBeDefined()

      const diviner = asDivinerInstance(await node.resolve('TokenInfoDiviner'))
      expect(diviner).toBeDefined()

      const addressPayload: BlockchainAddress = { address, chainId: 1, schema: BlockchainAddressSchema }
      profile(profiler, 'tokenReport')
      const report = await tokenSentinel?.report([addressPayload])
      console.log(`report: ${JSON.stringify(report, null, 2)}`)
      expect(report?.length).toBeGreaterThan(0)
    })
    afterAll(() => {
      const profileData = profileReport(profiler)
      if (profileData['tokenReport']) console.log(`Timer: ${profileData['tokenReport'] / tokenCount}ms`)
      console.log(`Profile: ${JSON.stringify(profileData, null, 2)}`)
    })
  })
})
