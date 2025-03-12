import { AbstractDiviner } from '@xyo-network/diviner-abstract'
// eslint-disable-next-line workspaces/no-absolute-imports
import type { EvmCallResults } from '@xyo-network/evm-call-witness'
import type { NftMetadataUri } from '@xyo-network/evm-nft-id-payload-plugin'
import { NftMetadataUriSchema } from '@xyo-network/evm-nft-id-payload-plugin'
import type { Payload, Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { EvmCallResultsSchema } from '../../../..'
import { EvmCallResultToNftTokenUriDivinerConfigSchema } from './Config.ts'
import type { EvmCallResultToNftTokenUriDivinerParams } from './Params.ts'
import type { EvmTokenUriCallResults } from './Payload.ts'

export class EvmCallResultToNftTokenUriDiviner<
  TParams extends EvmCallResultToNftTokenUriDivinerParams = EvmCallResultToNftTokenUriDivinerParams,
> extends AbstractDiviner<TParams, Payload, NftMetadataUri> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EvmCallResultToNftTokenUriDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = EvmCallResultToNftTokenUriDivinerConfigSchema

  // TODO: Add support for ERC1155 with `uri` function in addition to current ERC721 `tokenURI` support
  protected override divineHandler(payloads: Payload[] = []): NftMetadataUri[] {
    const evmCallResults = payloads.filter(isPayloadOfSchemaType<EvmCallResults>(EvmCallResultsSchema))
    const erc721CallResults = evmCallResults
      .filter((p): p is EvmTokenUriCallResults => {
        const casted = p as EvmTokenUriCallResults
        return casted.results?.tokenURI?.result !== undefined && (p.results?.tokenURI?.args?.length ?? 0) > 0
      })
      .map<NftMetadataUri>((p) => {
        const {
          address, chainId, results,
        } = p
        const { args, result } = results.tokenURI
        const tokenId = args[0]
        const num = Number(BigInt(tokenId)).toString()
        const metadataUri = result?.includes('{id}') ? result.replace('{id}', num) : result
        return {
          address, chainId, metadataUri, schema: NftMetadataUriSchema, tokenId,
        }
      })
    return erc721CallResults
  }
}
