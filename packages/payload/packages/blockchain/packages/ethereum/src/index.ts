export * from '@xyo-network/gas-ethereum-blockchain-payload-plugins'

import { EthereumGasPayloadPlugins } from '@xyo-network/gas-ethereum-blockchain-payload-plugins'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const EthereumPayloadPlugins: PayloadPluginFunc[] = [...EthereumGasPayloadPlugins]

// eslint-disable-next-line import-x/no-default-export
export default EthereumPayloadPlugins
