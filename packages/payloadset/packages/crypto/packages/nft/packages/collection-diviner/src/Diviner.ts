import type {
  NftCollectionInfo,
  NftCollectionMetadata,
  NftCollectionScore,
  NftCollectionScoreDivinerConfig,
} from '@xyo-network/crypto-nft-collection-payload-plugin'
import {
  isNftCollectionInfo,
  NftCollectionScoreDivinerConfigSchema,
  NftCollectionScoreSchema,
} from '@xyo-network/crypto-nft-collection-payload-plugin'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type { DivinerParams } from '@xyo-network/diviner-model'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, Schema } from '@xyo-network/payload-model'

import type { NftCollectionAnalysis } from './lib/index.ts'
import { analyzeNftCollection } from './lib/index.ts'

export type NftCollectionScoreDivinerParams = DivinerParams<AnyConfigSchema<NftCollectionScoreDivinerConfig>>

const toNftCollectionScore = (nftCollectionInfo: NftCollectionInfo, scores: NftCollectionAnalysis): NftCollectionScore => {
  const {
    // eslint-disable-next-line sonarjs/deprecation
    name, symbol, address, chainId, type,
  } = nftCollectionInfo
  const metadata: NftCollectionMetadata = {
    address, chainId, name, symbol, type,
  }
  return {
    ...metadata, schema: NftCollectionScoreSchema, scores,
  }
}

export class NftCollectionScoreDiviner<
  TParams extends NftCollectionScoreDivinerParams = NftCollectionScoreDivinerParams,
> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, NftCollectionScoreDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = NftCollectionScoreDivinerConfigSchema

  protected override divineHandler = async (payloads?: Payload[]): Promise<Payload[]> => {
    const nftCollectionInfos = payloads?.filter(isNftCollectionInfo) ?? []
    const results = await Promise.all(
      nftCollectionInfos.map<Promise<NftCollectionScore>>(async (nftCollectionInfo) => {
        const [score, sourceHash] = await Promise.all([
          // Get score
          toNftCollectionScore(nftCollectionInfo, await analyzeNftCollection(nftCollectionInfo)),
          // Hash sources
          PayloadBuilder.dataHash(nftCollectionInfo),
        ])
        return {
          ...score, schema: NftCollectionScoreSchema, sources: [sourceHash],
        } as NftCollectionScore
      }),
    )
    return results
  }
}
