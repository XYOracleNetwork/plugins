export * from '@xyo-network/ethereum-blockchain-plugins'

import { EthereumPlugins } from '@xyo-network/ethereum-blockchain-plugins'
import { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const BlockchainPlugins: PayloadSetPluginFunc[] = [...EthereumPlugins]

export default BlockchainPlugins
