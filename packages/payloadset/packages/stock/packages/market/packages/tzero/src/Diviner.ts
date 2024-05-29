import { exists } from '@xylabs/exists'
import { Promisable } from '@xylabs/promise'
import { ApiCallResult } from '@xyo-network/api-call-witness'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Schema, WithSources } from '@xyo-network/payload-model'
import { Snapshot } from '@xyo-network/tzero-stock-market-payload-plugin'

import { CoingeckoCryptoMarketDivinerConfig } from './Config'
import { tryMapToSnapshot } from './lib'
import { TZeroStockMarketDivinerConfigSchema } from './Schema'

export type CoingeckoCryptoMarketDivinerParams = DivinerParams<AnyConfigSchema<CoingeckoCryptoMarketDivinerConfig>>

export class CoingeckoCryptoMarketDiviner<
  TParams extends CoingeckoCryptoMarketDivinerParams = CoingeckoCryptoMarketDivinerParams,
> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, TZeroStockMarketDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = TZeroStockMarketDivinerConfigSchema

  protected override divineHandler(payloads?: ApiCallResult[]): Promisable<WithSources<Snapshot>[]> {
    if (!payloads) return []
    if (payloads.length === 0) return []
    return payloads.map(tryMapToSnapshot).filter(exists)
  }
}
