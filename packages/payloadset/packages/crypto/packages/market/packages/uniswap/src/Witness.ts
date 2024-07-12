import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import {
  UniswapCryptoMarketPayload,
  UniswapCryptoMarketSchema,
  UniswapCryptoMarketWitnessConfigSchema,
} from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { WitnessParams } from '@xyo-network/witness-model'
import { Provider } from 'ethers'

import { UniswapCryptoMarketWitnessConfig } from './Config.js'
import { createUniswapPoolContracts, EthersUniSwap3Pair, pricesFromUniswap3, UniswapPoolContracts } from './lib/index.js'

export type UniswapCryptoMarketWitnessParams = WitnessParams<
  AnyConfigSchema<UniswapCryptoMarketWitnessConfig>,
  {
    provider?: Provider
  }
>

export class UniswapCryptoMarketWitness<
  TParams extends UniswapCryptoMarketWitnessParams = UniswapCryptoMarketWitnessParams,
> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, UniswapCryptoMarketWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = UniswapCryptoMarketWitnessConfigSchema

  protected pairs?: EthersUniSwap3Pair[]
  protected get provider() {
    return this.params.provider
  }

  protected override async observeHandler(): Promise<Payload[]> {
    await this.started('throw')
    const pairs = await pricesFromUniswap3(assertEx(this.pairs))
    const timestamp = Date.now()

    const payload: UniswapCryptoMarketPayload = {
      pairs,
      schema: UniswapCryptoMarketSchema,
      timestamp,
    }

    return [payload]
  }

  protected override async startHandler() {
    await super.startHandler()
    this.pairs = createUniswapPoolContracts(
      assertEx(this.provider, () => 'Provider Required'),
      this.config?.pools ?? UniswapPoolContracts,
    )
    return true
  }
}
