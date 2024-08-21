import { describeIf } from '@xylabs/jest-helpers'
import { HDWallet } from '@xyo-network/account'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { asWitnessInstance } from '@xyo-network/witness-model'

import type { HttpCallJsonResult, HttpUriTemplateCall } from '../../Payload/index.ts'
import { HttpCallResultSchema, HttpCallSchema } from '../../Payload/index.ts'
import { HttpCallWitness } from '../Witness.ts'
import openseaNftsManifest from './opensea.nft-call.json'

describe('OpenSeaHttp', () => {
  const address = '0xECA1bB9c8d3Fd8b926372f42c8D4c6c3ed0669B3' // Random Wallet

  const apiKey = process.env.OPENSEA_API_KEY

  describeIf(apiKey)('report', () => {
    type OpenSeaNft = {
      /*
       * Collection slug. A unique string to identify a collection on OpenSea
       */
      collection: string
      /*
       * The unique public blockchain identifier for the contract
       */
      contract: string
      /**
       * @deprecated
       */
      created_at: string
      /*
       * Description of the NFT
       */
      description: string
      /*
       * The NFT's unique identifier within the smart contract (also referred to as token_id)
       */
      identifier: string
      /*
       * Link to the image associated with the NFT
       */
      image_url: string
      /*
       * If the item is currently able to be bought or sold using OpenSea
       */
      is_disabled: boolean
      /*
       * If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in OpenSea's NSFW Policy.
       */
      is_nsfw: boolean
      /*
       * Link to the offchain metadata store
       */
      metadata_url: string
      /*
       * Name of the NFT
       */
      name: string
      /*
       * ERC standard of the token (erc721, erc1155)
       */
      token_standard: string
      /*
       * Last time that the NFT's metadata was updated by OpenSea
       */
      updated_at: string
    }
    type OpenSeaListNftsByAccountResponse = {
      next: string
      nfts: OpenSeaNft[]
    }
    it('specifying address', async () => {
      const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
      const wallet = await HDWallet.fromPhrase(mnemonic)
      const locator = new ModuleFactoryLocator()

      locator.register(
        new ModuleFactory(HttpCallWitness, {
          config: { uriTemplate: 'https://api.opensea.io/api/v2/chain/ethereum/account/${address}/nfts' },
          headers: { 'x-api-key': apiKey },
        }),
      )

      const manifest = new ManifestWrapper(openseaNftsManifest as PackageManifestPayload, wallet, locator)

      const node = await manifest.loadNodeFromIndex(0)

      const mods = await node.resolve('*')

      expect(mods.length).toBeGreaterThan(1)

      const resolvedWitness = await node.resolve('HttpCallWitness')
      expect(resolvedWitness).toBeDefined()

      const witness = asWitnessInstance(resolvedWitness)
      expect(witness).toBeDefined()

      const sentinel = asSentinelInstance(await node.resolve('HttpCallSentinel'))
      expect(sentinel).toBeDefined()

      const call: HttpUriTemplateCall = { params: { address }, schema: HttpCallSchema }

      const report = await sentinel?.report([call])

      const apiCallResult = report?.find(isPayloadOfSchemaType<HttpCallJsonResult<OpenSeaListNftsByAccountResponse>>(HttpCallResultSchema))
      expect(apiCallResult).toBeDefined()
      expect(apiCallResult?.schema).toBeString()
      expect(apiCallResult?.data.nfts).toBeArrayOfSize(1)
      expect(apiCallResult?.data.nfts[0].collection).toBeString()
    })
  })
})
