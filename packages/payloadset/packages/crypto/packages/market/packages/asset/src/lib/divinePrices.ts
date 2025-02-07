import { exists } from '@xylabs/exists'
import type { CoingeckoCryptoMarketPayload } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import type { CryptoMarketAssetPayload } from '@xyo-network/crypto-asset-payload-plugin'
import { CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { UniswapCryptoMarketPayload } from '@xyo-network/uniswap-crypto-market-payload-plugin'

import { average } from './average.ts'
import { divineCoinGeckoPrices } from './divineCoinGeckoPrices.ts'
import { divineUniswapPrices } from './divineUniswapPrices.ts'

const schema = CryptoMarketAssetSchema

export const divinePrices = (
  coinGeckoPayload: CoingeckoCryptoMarketPayload | undefined,
  uniswapPayload: UniswapCryptoMarketPayload | undefined,
): CryptoMarketAssetPayload => {
  const coinGeckoPrices = divineCoinGeckoPrices(coinGeckoPayload)
  const uniswapPrices = divineUniswapPrices(uniswapPayload)
  const prices = [uniswapPayload, coinGeckoPayload].some(exists)
  const assets = prices ? average(coinGeckoPrices, uniswapPrices) : {}
  const timestamp = Date.now()
  return new PayloadBuilder<CryptoMarketAssetPayload>({ schema }).fields({ assets, timestamp }).build()
}
