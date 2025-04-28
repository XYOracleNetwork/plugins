/* eslint-disable max-statements */

import '@xylabs/vitest-extended'

import {
  createProfiler, profile, profileReport,
} from '@xylabs/profile'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import {
  ERC721__factory, ERC721Enumerable__factory, ERC721URIStorage__factory, ERC1155__factory,
} from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { asWitnessInstance } from '@xyo-network/witness-model'
import {
  afterAll,
  describe, expect, it,
} from 'vitest'

import type { EvmCallResults } from '../Diviner.ts'
import { EvmCallDiviner, EvmCallResultsSchema } from '../Diviner.ts'
import type { EvmCall } from '../Payload.ts'
import { EvmCallSchema } from '../Payload.ts'
import { EvmCallWitness } from '../Witness.ts'
import erc721TokenSentinelManifest from './Erc721TokenSentinel.json' with { type: 'json' }

const profiler = createProfiler()

const tokenCount = 0
const maxProviders = 2

describe('Erc721Sentinel - Token', () => {
  // const address = '0x562fC2927c77cB975680088566ADa1dC6cB8b5Ea' //Random ERC721
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' // Bored Apes
  // const address = '0x495f947276749Ce646f68AC8c248420045cb7b5e' //OpenSea Storefront
  // const address = '0x6802df79bcbbf019fe5cb366ff25720d1365cfd3' //Upgradeable

  const tokenId = 1

  const providers = getProvidersFromEnv(maxProviders)

  describe.skipIf(providers.length === 0)('report', () => {
    it('specifying address', async () => {
      profile(profiler, 'setup')
      const wallet = await HDWallet.random()
      const locator = new ModuleFactoryLocator()
      locator.register(EvmCallDiviner)

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
        { 'network.xyo.evm.interface': 'ERC721URIStorage' },
      )

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC1155__factory.abi },
          providers: () => getProvidersFromEnv(maxProviders),
        }),
        { 'network.xyo.evm.interface': 'Erc1155' },
      )

      profile(profiler, 'setup')
      profile(profiler, 'manifest')
      const manifest = new ManifestWrapper(erc721TokenSentinelManifest as PackageManifestPayload, wallet, locator)
      profile(profiler, 'manifest-load')
      const node = await manifest.loadNodeFromIndex(0)
      profile(profiler, 'manifest-load')
      profile(profiler, 'manifest-resolve')
      const mods = await node.resolve('*')
      profile(profiler, 'manifest-resolve')
      profile(profiler, 'manifest')
      expect(mods.length).toBe(6)

      const tokenSentinel = asSentinelInstance(await node.resolve('NftTokenInfoSentinel'))
      expect(tokenSentinel).toBeDefined()

      const tokenUriWitness = asWitnessInstance(await node.resolve('Erc721TokenURIWitness'))
      expect(tokenUriWitness).toBeDefined()

      const ownerOfWitness = asWitnessInstance(await node.resolve('Erc721OwnerOfWitness'))
      expect(ownerOfWitness).toBeDefined()

      const uriWitness = asWitnessInstance(await node.resolve('Erc1155UriWitness'))
      expect(uriWitness).toBeDefined()

      const diviner = asDivinerInstance(await node.resolve('TokenInfoDiviner'))
      expect(diviner).toBeDefined()

      const tokenCallPayload: EvmCall = {
        address, args: [tokenId], schema: EvmCallSchema,
      }
      profile(profiler, 'tokenReport')
      const report = await tokenSentinel?.report([tokenCallPayload])
      const info = report?.find(isPayloadOfSchemaType<EvmCallResults>(EvmCallResultsSchema))
      console.log(`info: ${JSON.stringify(info, null, 2)}`)
      expect(info?.results?.['ownerOf']?.result).toBeString()
      expect(info?.results?.['tokenURI']?.result).toBeString()
    })
    afterAll(() => {
      const profileData = profileReport(profiler)
      if (profileData['tokenReport']) console.log(`Timer: ${profileData['tokenReport'] / tokenCount}ms`)
      console.log(`Profile: ${JSON.stringify(profileData, null, 2)}`)
    })
  })
})
