import { assertEx } from '@xylabs/sdk-js'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { type AnyConfigSchema, creatableModule } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { UniswapCryptoMarketPayload } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { UniswapCryptoMarketSchema, UniswapCryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { WitnessParams } from '@xyo-network/witness-model'
import type { Provider } from 'ethers'

import type { UniswapCryptoMarketWitnessConfig } from './Config.ts'
import type { EthersUniSwap3Pair } from './lib/index.ts'
import {
  createUniswapPoolContracts, pricesFromUniswap3, UniswapPoolContracts,
} from './lib/index.ts'

export interface UniswapCryptoMarketWitnessParams extends WitnessParams<
  AnyConfigSchema<UniswapCryptoMarketWitnessConfig>>
{
  provider?: Provider
}

@creatableModule()
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
  }
}
