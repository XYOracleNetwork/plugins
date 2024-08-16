export * from '@xyo-network/coingecko-crypto-market-payload-plugin'
export * from '@xyo-network/crypto-asset-payload-plugin'
export * from '@xyo-network/uniswap-crypto-market-payload-plugin'

import { CoingeckoCryptoMarketPayloadPlugin } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { CryptoMarketAssetPayloadPlugin } from '@xyo-network/crypto-asset-payload-plugin'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'
import { UniswapCryptoMarketPayloadPlugin } from '@xyo-network/uniswap-crypto-market-payload-plugin'

export const CryptoMarketPayloadPlugins: PayloadPluginFunc[] = [
  CoingeckoCryptoMarketPayloadPlugin,
  UniswapCryptoMarketPayloadPlugin,
  CryptoMarketAssetPayloadPlugin,
]

// eslint-disable-next-line import-x/no-default-export
export default CryptoMarketPayloadPlugins
