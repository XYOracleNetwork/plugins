export * from '@xyo-network/gas-ethereum-blockchain-plugins'

import { EthereumGasPlugins } from '@xyo-network/gas-ethereum-blockchain-plugins'
import { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const EthereumPlugins: PayloadSetPluginFunc[] = [...EthereumGasPlugins]

export default EthereumPlugins
