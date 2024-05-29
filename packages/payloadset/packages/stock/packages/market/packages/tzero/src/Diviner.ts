import { Promisable } from '@xylabs/promise'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload, PayloadFields, Schema, WithSources } from '@xyo-network/payload-model'

import { CoingeckoCryptoMarketDivinerConfig } from './Config'
import { TZeroStockMarketDivinerConfigSchema } from './Schema'

export type CoingeckoCryptoMarketDivinerParams = DivinerParams<AnyConfigSchema<CoingeckoCryptoMarketDivinerConfig>>

export class CoingeckoCryptoMarketDiviner<
  TParams extends CoingeckoCryptoMarketDivinerParams = CoingeckoCryptoMarketDivinerParams,
> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, TZeroStockMarketDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = TZeroStockMarketDivinerConfigSchema

  protected override divineHandler(
    payloads?: ({ schema: string } & PayloadFields)[] | undefined,
  ): Promisable<WithSources<{ schema: string } & PayloadFields>[]> {
    throw new Error('Method not implemented.')
  }
}
