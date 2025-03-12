export * from '@xyo-network/crypto-cards-plugins'
export * from '@xyo-network/crypto-market-plugins'

import { CryptoCardsPlugins } from '@xyo-network/crypto-cards-plugins'
import { CryptoMarketPlugins } from '@xyo-network/crypto-market-plugins'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const CryptoPlugins: PayloadSetPluginFunc[] = [...CryptoCardsPlugins, ...CryptoMarketPlugins]

export default CryptoPlugins
