import { exists } from '@xylabs/exists'
import { Promisable } from '@xylabs/promise'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload, Schema, WithSources } from '@xyo-network/payload-model'
import { Snapshot } from '@xyo-network/tzero-stock-market-payload-plugin'

import { TZeroStockMarketDivinerConfig } from './Config'
import { tryMapToSnapshot } from './lib'
import { TZeroStockMarketDivinerConfigSchema } from './Schema'

export type TZeroStockMarketDivinerParams = DivinerParams<AnyConfigSchema<TZeroStockMarketDivinerConfig>>

export class TZeroStockMarketDiviner<TParams extends TZeroStockMarketDivinerParams = TZeroStockMarketDivinerParams> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, TZeroStockMarketDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = TZeroStockMarketDivinerConfigSchema

  protected override divineHandler(payloads?: Payload[]): Promisable<WithSources<Snapshot>[]> {
    if (!payloads) return []
    if (payloads.length === 0) return []
    return payloads.map(tryMapToSnapshot).filter(exists)
  }
}
