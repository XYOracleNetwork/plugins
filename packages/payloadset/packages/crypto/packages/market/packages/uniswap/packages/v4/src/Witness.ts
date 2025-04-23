import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import { UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { WitnessParams } from '@xyo-network/witness-model'
import type { Provider } from 'ethers'

import type { UniswapV4CryptoMarketWitnessConfig } from './Config.ts'

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

  protected get provider() {
    return this.params.provider
  }

  protected override async observeHandler(): Promise<Payload[]> {
    await this.started('throw')
    // TODO: witness
    return[]
  }

  protected override async startHandler() {
    await super.startHandler()
    // TODO: bootstrap
    return true
  }
}
