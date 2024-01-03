// eslint-disable-next-line simple-import-sort/imports
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerConfig, DivinerParams } from '@xyo-network/diviner-model'
import { NftMetadataUri, NftMetadataUriSchema } from '@xyo-network/evm-nft-id-payload-plugin'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

// eslint-disable-next-line workspaces/no-absolute-imports
import { EvmCallResults, EvmCallResultsSchema } from '@xyo-network/evm-call-witness'

export type EvmCallResultsTokenUri = EvmCallResults & { results: { tokenURI: { args: [string]; result?: string } } }

// Schema
export const EvmCallResultToNftTokenUriDivinerConfigSchema = 'foo.bar'
export type EvmCallResultToNftTokenUriDivinerConfigSchema = typeof EvmCallResultToNftTokenUriDivinerConfigSchema
// Config
export type EvmCallResultToNftTokenUriDivinerConfig = DivinerConfig<{ schema: EvmCallResultToNftTokenUriDivinerConfigSchema }>
// Params
export type EvmCallResultToNftTokenUriDivinerParams = DivinerParams<AnyConfigSchema<EvmCallResultToNftTokenUriDivinerConfig>>

export class EvmCallResultToNftTokenUriDiviner extends AbstractDiviner {
  static override configSchemas = [EvmCallResultToNftTokenUriDivinerConfigSchema]

  protected override divineHandler(payloads: Payload[] = []): NftMetadataUri[] {
    const evmCallResults = payloads.filter(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults[]
    const erc721CallResults = evmCallResults
      .filter((p): p is EvmCallResultsTokenUri => {
        const casted = p as EvmCallResultsTokenUri
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
