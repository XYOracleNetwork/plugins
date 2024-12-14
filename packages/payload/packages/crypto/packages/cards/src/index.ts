export * from '@xyo-network/crypto-cards-game-payload-plugin'
export * from '@xyo-network/crypto-cards-move-payload-plugin'

import { CryptoCardsGamePayloadPlugin } from '@xyo-network/crypto-cards-game-payload-plugin'
import { CryptoCardsMovePayloadPlugin } from '@xyo-network/crypto-cards-move-payload-plugin'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const CryptoCardsPayloadPlugins: PayloadPluginFunc[] = [CryptoCardsGamePayloadPlugin, CryptoCardsMovePayloadPlugin]

export default CryptoCardsPayloadPlugins
