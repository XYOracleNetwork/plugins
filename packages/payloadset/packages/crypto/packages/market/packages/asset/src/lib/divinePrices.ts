import { exists } from '@xylabs/exists'
import { CoingeckoCryptoMarketPayload } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { CryptoMarketAssetPayload, CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { UniswapCryptoMarketPayload } from '@xyo-network/uniswap-crypto-market-payload-plugin'

import { average } from './average.js'
import { divineCoinGeckoPrices } from './divineCoinGeckoPrices.js'
import { divineUniswapPrices } from './divineUniswapPrices.js'

const schema = CryptoMarketAssetSchema

export const divinePrices = async (
  coinGeckoPayload: CoingeckoCryptoMarketPayload | undefined,
  uniswapPayload: UniswapCryptoMarketPayload | undefined,
): Promise<CryptoMarketAssetPayload> => {
  const coinGeckoPrices = await divineCoinGeckoPrices(coinGeckoPayload)
  const uniswapPrices = await divineUniswapPrices(uniswapPayload)
  const prices = [uniswapPayload, coinGeckoPayload].some(exists)
  const assets = prices ? average(coinGeckoPrices, uniswapPrices) : {}
  const timestamp = Date.now()
  return await new PayloadBuilder<CryptoMarketAssetPayload>({ schema }).fields({ assets, timestamp }).build()
}
