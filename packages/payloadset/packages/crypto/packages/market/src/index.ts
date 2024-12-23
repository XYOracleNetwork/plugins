export * from '@xyo-network/coingecko-crypto-market-plugin'
export * from '@xyo-network/crypto-asset-plugin'
export * from '@xyo-network/uniswap-crypto-market-plugin'

import { CoingeckoCryptoMarketPlugin } from '@xyo-network/coingecko-crypto-market-plugin'
import { CryptoMarketAssetPlugin } from '@xyo-network/crypto-asset-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'
import { UniswapCryptoMarketPlugin } from '@xyo-network/uniswap-crypto-market-plugin'

export const CryptoMarketPlugins: PayloadSetPluginFunc[] = [CoingeckoCryptoMarketPlugin, UniswapCryptoMarketPlugin, CryptoMarketAssetPlugin]

export default CryptoMarketPlugins
