/* eslint-disable max-statements */
import { describeIf } from '@xylabs/jest-helpers'
import { HDWallet } from '@xyo-network/account'
import { EvmCall, EvmCallDiviner, EvmCallResults, EvmCallResultsSchema, EvmCallSchema, EvmCallWitness } from '@xyo-network/evm-call-witness'
import { NftMetadataUri, NftMetadataUriSchema } from '@xyo-network/evm-nft-id-payload-plugin'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721URIStorage__factory } from '@xyo-network/open-zeppelin-typechain'
import { isPayload, isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'

import nftIdToNftMetadataUri from './NftIdToNftMetadataUri.json'

const maxProviders = 2
const providers = getProvidersFromEnv(maxProviders)

type EvmCallResultsTokenUri = EvmCallResults & { results: { tokenURI: { args: [string]; result: string } } }

const divine = async (payloads: Payload[]): Promise<NftMetadataUri[]> => {
  await Promise.resolve()
  const evmCallResults = payloads.filter(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults[]
  const erc721CallResults = evmCallResults
    .filter((p): p is EvmCallResultsTokenUri => {
      const casted = p as EvmCallResultsTokenUri
      return casted.results?.tokenURI?.result !== undefined && (p.results?.tokenURI?.args?.length ?? 0) > 0
    })
    .map<NftMetadataUri>((p) => {
      const { address, chainId, results } = p
      const { args, result: metadataUri } = results.tokenURI
      const tokenId = args[0]
      const tempChainId = 1
      return { address, chainId: tempChainId, metadataUri, schema: NftMetadataUriSchema, tokenId }
    })
  return erc721CallResults
}

describeIf(providers.length)('NftIdToNftMetadataUri', () => {
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' //Bored Apes
  const tokenId = '0x0f'
  let node: MemoryNode
  beforeAll(async () => {
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
    const manifest = nftIdToNftMetadataUri as PackageManifestPayload
    const manifestWrapper = new ManifestWrapper(manifest, wallet, locator)
    node = await manifestWrapper.loadNodeFromIndex(0)
    const mods = await node.resolve()
    const privateModules = manifest.nodes[0].modules?.private ?? []
    const publicModules = manifest.nodes[0].modules?.public ?? []
    expect(mods.length).toBe(privateModules.length + publicModules.length + 1)
  })
  describe('Sentinel', () => {
    it('returns metadata URI for token ID', async () => {
      const tokenCallPayload: EvmCall = { address, args: [tokenId], schema: EvmCallSchema }
      const tokenSentinel = asSentinelInstance(await node.resolve('NftTokenUriSentinel'))
      expect(tokenSentinel).toBeDefined()
      const report = await tokenSentinel?.report([tokenCallPayload])
      const info = report?.find(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults | undefined
      console.log(`info: ${JSON.stringify(info, null, 2)}`)
      expect(info?.results?.['tokenURI']?.result).toBeString()
      // TODO: Make NFT URI payload
    })
  })
  describe('Index', () => {
    it.skip('returns indexed NftIndex results', async () => {
      const tokenCallPayload: EvmCall = { address, args: [tokenId], schema: EvmCallSchema }
      const tokenSentinel = asSentinelInstance(await node.resolve('NftTokenUriSentinel'))
      expect(tokenSentinel).toBeDefined()
      const report = await tokenSentinel?.report([tokenCallPayload])
      const info = report?.find(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults | undefined
      console.log(`info: ${JSON.stringify(info, null, 2)}`)
      expect(info?.results?.['tokenURI']?.result).toBeString()
    })
  })
})
