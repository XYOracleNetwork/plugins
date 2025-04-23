import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import { UniswapCryptoMarketPayload, UniswapCryptoMarketSchema, UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { WitnessParams } from '@xyo-network/witness-model'
import type { Provider } from 'ethers'

import type { UniswapV4CryptoMarketWitnessConfig } from './Config.ts'
import { pricesFromUniswapV4, UniswapV4DefaultPools } from './lib/index.ts'
import { TokenPairPoolKey } from './types/index.ts'

export type UniswapV4CryptoMarketWitnessParams = WitnessParams<
  AnyConfigSchema<UniswapV4CryptoMarketWitnessConfig>,
  {
    provider?: Provider
  }
>

export class UniswapV4CryptoMarketWitness<
  TParams extends UniswapV4CryptoMarketWitnessParams = UniswapV4CryptoMarketWitnessParams,
> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, UniswapCryptoMarketWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = UniswapCryptoMarketWitnessConfigSchema

  protected get pools(): TokenPairPoolKey[] {
    return this.config?.poolKeys ?? Object.values(UniswapV4DefaultPools)
  }

  protected get provider() {
    return assertEx(this.params.provider, () => 'Provider Required')
  }

  protected override async observeHandler(): Promise<Payload[]> {
    await this.started('throw')
    const pairs = await pricesFromUniswapV4(this.pools, this.provider)
    const timestamp = Date.now()
    const payload: UniswapCryptoMarketPayload = { pairs, schema: UniswapCryptoMarketSchema, timestamp }
    return [payload]
  }

  protected override async startHandler() {
    await super.startHandler()
    return true
  }
}
