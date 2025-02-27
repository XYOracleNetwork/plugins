export * from '@xyo-network/ethereum-blockchain-payload-plugins'

import { EthereumPayloadPlugins } from '@xyo-network/ethereum-blockchain-payload-plugins'
import { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const BlockchainPayloadPlugins: PayloadPluginFunc[] = [...EthereumPayloadPlugins]

export default BlockchainPayloadPlugins
