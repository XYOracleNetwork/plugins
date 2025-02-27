import { exists } from '@xylabs/exists'
import { Promisable } from '@xylabs/promise'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'
import {
  Payload, Schema, WithOptionalSources,
} from '@xyo-network/payload-model'
import { Snapshot } from '@xyo-network/tzero-stock-market-payload-plugin'

import { TZeroStockMarketDivinerConfig } from './Config.ts'
import { tryMapToSnapshot } from './lib/index.ts'
import { TZeroApiCallJsonResultToSnapshotDivinerConfigSchema } from './Schema.ts'

export type TZeroApiCallJsonResultToSnapshotDivinerParams = DivinerParams<AnyConfigSchema<TZeroStockMarketDivinerConfig>>

export class TZeroApiCallJsonResultToSnapshotDiviner<
  TParams extends TZeroApiCallJsonResultToSnapshotDivinerParams = TZeroApiCallJsonResultToSnapshotDivinerParams,
> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, TZeroApiCallJsonResultToSnapshotDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = TZeroApiCallJsonResultToSnapshotDivinerConfigSchema

  protected override divineHandler(payloads?: Payload[]): Promisable<WithOptionalSources<Snapshot>[]> {
    if (!payloads) return []
    if (payloads.length === 0) return []
    return payloads.map(tryMapToSnapshot).filter(exists)
  }
}
