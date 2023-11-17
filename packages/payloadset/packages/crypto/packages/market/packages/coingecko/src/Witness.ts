import { AbstractWitness } from '@xyo-network/abstract-witness'
import { CoingeckoCryptoMarketPayload, CoingeckoCryptoMarketSchema } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload } from '@xyo-network/payload-model'
import { WitnessParams } from '@xyo-network/witness-model'

import { CoingeckoCryptoMarketWitnessConfig } from './Config'
import { pricesFromCoingecko } from './lib'
import { CoingeckoCryptoMarketWitnessConfigSchema } from './Schema'

export type CoingeckoCryptoMarketWitnessParams = WitnessParams<AnyConfigSchema<CoingeckoCryptoMarketWitnessConfig>>

export class CoingeckoCryptoMarketWitness<
  TParams extends CoingeckoCryptoMarketWitnessParams = CoingeckoCryptoMarketWitnessParams,
> extends AbstractWitness<TParams> {
  static override configSchemas = [CoingeckoCryptoMarketWitnessConfigSchema]

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
