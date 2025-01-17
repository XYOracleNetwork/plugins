export * from '@xyo-network/crypto-cards-game-plugin'
export * from '@xyo-network/crypto-cards-move-plugin'

import { CryptoCardsGamePlugin } from '@xyo-network/crypto-cards-game-plugin'
import { CryptoCardsMovePlugin } from '@xyo-network/crypto-cards-move-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const CryptoCardsPlugins: PayloadSetPluginFunc[] = [CryptoCardsGamePlugin, CryptoCardsMovePlugin]

export default CryptoCardsPlugins
