import { AbstractDiviner } from '@xyo-network/diviner-abstract'
// eslint-disable-next-line workspaces/no-absolute-imports
import { EvmCallResults, EvmCallResultsSchema } from '@xyo-network/evm-call-witness'
import { NftMetadataUri, NftMetadataUriSchema } from '@xyo-network/evm-nft-id-payload-plugin'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { EvmCallResultToNftTokenUriDivinerConfigSchema } from './Config'
import { EvmCallResultToNftTokenUriDivinerParams } from './Params'

export type EvmTokenUriCallResults = EvmCallResults & { results: { tokenURI: { args: [string]; result?: string } } }

export class EvmCallResultToNftTokenUriDiviner<
  TParams extends EvmCallResultToNftTokenUriDivinerParams = EvmCallResultToNftTokenUriDivinerParams,
> extends AbstractDiviner<TParams, Payload, NftMetadataUri> {
  static override configSchemas = [EvmCallResultToNftTokenUriDivinerConfigSchema]

  // TODO: Add support for ERC1155 with `uri` function in addition to current ERC721 `tokenURI` support
  protected override divineHandler(payloads: Payload[] = []): NftMetadataUri[] {
    const evmCallResults = payloads.filter(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults[]
    const erc721CallResults = evmCallResults
      .filter((p): p is EvmTokenUriCallResults => {
        const casted = p as EvmTokenUriCallResults
        return casted.results?.tokenURI?.result !== undefined && (p.results?.tokenURI?.args?.length ?? 0) > 0
      })
      .map<NftMetadataUri>((p) => {
        const { address, chainId, results } = p
        const { args, result } = results.tokenURI
        const tokenId = args[0]
        const num = Number(BigInt(tokenId)).toString()
        const metadataUri = result?.includes('{id}') ? result.replace('{id}', num) : result
        return { address, chainId, metadataUri, schema: NftMetadataUriSchema, tokenId }
      })
    return erc721CallResults
  }
}
