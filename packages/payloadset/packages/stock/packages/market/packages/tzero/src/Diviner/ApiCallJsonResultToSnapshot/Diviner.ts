import type { Promisable } from '@xylabs/sdk-js'
import { exists } from '@xylabs/sdk-js'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type { DivinerParams } from '@xyo-network/diviner-model'
import { type AnyConfigSchema, creatableModule } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { Snapshot } from '@xyo-network/tzero-stock-market-payload-plugin'

import type { TZeroStockMarketDivinerConfig } from './Config.ts'
import { tryMapToSnapshot } from './lib/index.ts'
import { TZeroApiCallJsonResultToSnapshotDivinerConfigSchema } from './Schema.ts'

export interface TZeroApiCallJsonResultToSnapshotDivinerParams extends DivinerParams<AnyConfigSchema<TZeroStockMarketDivinerConfig>> {}

creatableModule()
export class TZeroApiCallJsonResultToSnapshotDiviner<
  TParams extends TZeroApiCallJsonResultToSnapshotDivinerParams = TZeroApiCallJsonResultToSnapshotDivinerParams,
> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, TZeroApiCallJsonResultToSnapshotDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = TZeroApiCallJsonResultToSnapshotDivinerConfigSchema

  protected override divineHandler(payloads?: Payload[]): Promisable<Payload<Snapshot>[]> {
    if (!payloads) return []
    if (payloads.length === 0) return []
    return payloads.map(tryMapToSnapshot).filter(exists)
  }
}
