/* eslint-disable max-statements */
import { describeIf } from '@xylabs/jest-helpers'
import { createProfiler, profile, profileReport } from '@xylabs/profile'
import { HDWallet } from '@xyo-network/account'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { EvmCall, EvmCallDiviner, EvmCallResults, EvmCallResultsSchema, EvmCallSchema, EvmCallWitness } from '@xyo-network/evm-call-witness'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { ERC721URIStorage__factory } from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { asWitnessInstance } from '@xyo-network/witness-model'

import erc721TokenSentinelManifest from './NftIdToNftMetadataUri.json'

const profiler = createProfiler()

const tokenCount = 0
const maxProviders = 2

describe('Sentinel', () => {
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' //Bored Apes
  const tokenId = 1
  const providers = getProvidersFromEnv(maxProviders)
  describeIf(providers.length)('report', () => {
    it('Returns metadata for token ID', async () => {
      profile(profiler, 'setup')
      const wallet = await HDWallet.random()
      const locator = new ModuleFactoryLocator()
      locator.register(EvmCallDiviner)
      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721URIStorage__factory.abi },
          providers: () => getProvidersFromEnv(maxProviders),
        }),
        { 'network.xyo.evm.interface': 'ERC721TokenUri' },
      )
      profile(profiler, 'setup')
      profile(profiler, 'manifest')
      const manifest = erc721TokenSentinelManifest as PackageManifestPayload
      const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
      profile(profiler, 'manifest-load')
      const node = await manifestWrapper.loadNodeFromIndex(0)
      profile(profiler, 'manifest-load')
      profile(profiler, 'manifest-resolve')
      const mods = await node.resolve()
      profile(profiler, 'manifest-resolve')
      profile(profiler, 'manifest')
      const privateModules = manifest.nodes[0].modules?.private ?? []
      const publicModules = manifest.nodes[0].modules?.public ?? []
      expect(mods.length).toBe(privateModules.length + publicModules.length + 1)

      const tokenSentinel = asSentinelInstance(await node.resolve('NftTokenUriSentinel'))
      expect(tokenSentinel).toBeDefined()

      const tokenUriWitness = asWitnessInstance(await node.resolve('Erc721TokenURIWitness'))
      expect(tokenUriWitness).toBeDefined()

      const diviner = asDivinerInstance(await node.resolve('EvmCallDiviner'))
      expect(diviner).toBeDefined()

      const tokenCallPayload: EvmCall = { address, args: [tokenId], schema: EvmCallSchema }
      profile(profiler, 'tokenReport')
      const report = await tokenSentinel?.report([tokenCallPayload])
      const info = report?.find(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults | undefined
      console.log(`info: ${JSON.stringify(info, null, 2)}`)
      expect(info?.results?.['tokenURI']?.result).toBeString()
    })
    afterAll(() => {
      const profileData = profileReport(profiler)
      if (profileData['tokenReport']) console.log(`Timer: ${profileData['tokenReport'] / tokenCount}ms`)
      console.log(`Profile: ${JSON.stringify(profileData, null, 2)}`)
    })
  })
})
