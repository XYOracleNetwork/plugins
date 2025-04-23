import type { CoingeckoCryptoMarketPayload } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { CoingeckoCryptoMarketSchema } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import type { CryptoMarketAssetPayload } from '@xyo-network/crypto-asset-payload-plugin'
import { CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type {
  DivinerConfig, DivinerModule, DivinerParams,
} from '@xyo-network/diviner-model'
import type { AnyConfigSchema, Module } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { UniswapCryptoMarketPayload } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { UniswapCryptoMarketSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'

import { divinePrices } from './lib/index.ts'
import { CryptoMarketAssetDivinerConfigSchema } from './Schema.ts'

export type CryptoMarketAssetDivinerConfig = DivinerConfig<{ schema: CryptoMarketAssetDivinerConfigSchema }>
export type CryptoMarketAssetDivinerParams = DivinerParams<AnyConfigSchema<CryptoMarketAssetDivinerConfig>>

export class CryptoMarketAssetDiviner<TParams extends CryptoMarketAssetDivinerParams = CryptoMarketAssetDivinerParams>
  extends AbstractDiviner<TParams>
  implements DivinerModule, Module {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CryptoMarketAssetDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = CryptoMarketAssetDivinerConfigSchema
  static override readonly targetSchema = CryptoMarketAssetSchema

  protected override divineHandler(payloads?: Payload[]): Payload[] {
    const coinGeckoPayload = payloads?.find(payload => payload?.schema === CoingeckoCryptoMarketSchema) as CoingeckoCryptoMarketPayload | undefined
    const uniswapPayload = payloads?.find(payload => payload?.schema === UniswapCryptoMarketSchema) as UniswapCryptoMarketPayload | undefined
    const result: CryptoMarketAssetPayload = divinePrices(coinGeckoPayload, uniswapPayload)
    return [result]
  }
}
