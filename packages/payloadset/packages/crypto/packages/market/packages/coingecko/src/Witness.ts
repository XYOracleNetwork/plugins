import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { CoingeckoCryptoMarketPayload } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { CoingeckoCryptoMarketSchema } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessParams } from '@xyo-network/witness-model'

import type { CoingeckoCryptoMarketWitnessConfig } from './Config.ts'
import { pricesFromCoingecko } from './lib/index.ts'
import { CoingeckoCryptoMarketWitnessConfigSchema } from './Schema.ts'

export type CoingeckoCryptoMarketWitnessParams = WitnessParams<AnyConfigSchema<CoingeckoCryptoMarketWitnessConfig>>

export class CoingeckoCryptoMarketWitness<
  TParams extends CoingeckoCryptoMarketWitnessParams = CoingeckoCryptoMarketWitnessParams,
> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CoingeckoCryptoMarketWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = CoingeckoCryptoMarketWitnessConfigSchema

  protected override async observeHandler(): Promise<Payload[]> {
    const assets: CoingeckoCryptoMarketPayload['assets'] = await pricesFromCoingecko(this.config?.coins ?? [], this.config?.currencies ?? [])
    const payload: CoingeckoCryptoMarketPayload = {
      assets,
      schema: CoingeckoCryptoMarketSchema,
      timestamp: Date.now(),
    }

    return [payload]
  }
}
