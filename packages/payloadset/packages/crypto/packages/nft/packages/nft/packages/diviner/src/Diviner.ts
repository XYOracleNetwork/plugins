import type {
  NftInfo,
  NftScore,
  NftScoreDivinerConfig,
} from '@xyo-network/crypto-nft-payload-plugin'
import {
  isNftInfo,
  NftScoreDivinerConfigSchema,
  NftScoreSchema,
} from '@xyo-network/crypto-nft-payload-plugin'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type { DivinerParams } from '@xyo-network/diviner-model'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, Schema } from '@xyo-network/payload-model'

import type { NftAnalysis } from './lib/index.ts'
import { analyzeNft } from './lib/index.ts'

export type NftScoreDivinerParams = DivinerParams<AnyConfigSchema<NftScoreDivinerConfig>>

const toNftScorePayload = (nftInfo: NftInfo, scores: NftAnalysis): NftScore => {
  const {

    address, chainId, types,
  } = nftInfo
  return {
    address, chainId, schema: NftScoreSchema, scores, types,
  }
}

export const isNftScore = (payload: Payload): payload is NftScore => payload.schema === NftScoreSchema

export class NftScoreDiviner<TParams extends NftScoreDivinerParams = NftScoreDivinerParams> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, NftScoreDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = NftScoreDivinerConfigSchema

  protected override divineHandler = async (payloads?: Payload[]): Promise<Payload[]> => {
    const nftInfos = payloads?.filter(isNftInfo) ?? []
    const results = await Promise.all(
      nftInfos.map<Promise<NftScore>>(async (nftInfo) => {
        const [score, sourceHash] = await Promise.all([
          // Analyze the NFT
          toNftScorePayload(nftInfo, await analyzeNft(nftInfo)),
          // Hash the source payload
          PayloadBuilder.dataHash(nftInfo),
        ])
        return { ...score, sources: [sourceHash] }
      }),
    )
    return results
  }
}
