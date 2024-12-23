export * from '@xyo-network/gas-ethereum-blockchain-payload-plugins'

import { EthereumGasPayloadPlugins } from '@xyo-network/gas-ethereum-blockchain-payload-plugins'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const EthereumPayloadPlugins: PayloadPluginFunc[] = [...EthereumGasPayloadPlugins]

export default EthereumPayloadPlugins
