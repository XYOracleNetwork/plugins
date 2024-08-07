import { CoingeckoCryptoMarketPayload, CoingeckoCryptoMarketSchema } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { CryptoMarketAssetPayload, CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerConfig, DivinerModule, DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema, Module } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import { UniswapCryptoMarketPayload, UniswapCryptoMarketSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'

import { divinePrices } from './lib/index.ts'
import { CryptoMarketAssetDivinerConfigSchema } from './Schema.ts'

export type CryptoMarketAssetDivinerConfig = DivinerConfig<{ schema: CryptoMarketAssetDivinerConfigSchema }>
export type CryptoMarketAssetDivinerParams = DivinerParams<AnyConfigSchema<CryptoMarketAssetDivinerConfig>>

export class CryptoMarketAssetDiviner<TParams extends CryptoMarketAssetDivinerParams = CryptoMarketAssetDivinerParams>
  extends AbstractDiviner<TParams>
  implements DivinerModule, Module {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CryptoMarketAssetDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = CryptoMarketAssetDivinerConfigSchema
  static override targetSchema = CryptoMarketAssetSchema

  protected override async divineHandler(payloads?: Payload[]): Promise<Payload[]> {
    const coinGeckoPayload = payloads?.find(payload => payload?.schema === CoingeckoCryptoMarketSchema) as CoingeckoCryptoMarketPayload
    const uniswapPayload = payloads?.find(payload => payload?.schema === UniswapCryptoMarketSchema) as UniswapCryptoMarketPayload
    const result: CryptoMarketAssetPayload = await divinePrices(coinGeckoPayload, uniswapPayload)
    return [result]
  }
}
