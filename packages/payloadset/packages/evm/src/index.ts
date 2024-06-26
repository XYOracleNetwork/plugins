export * from '@xyo-network/erc1822-witness'
export * from '@xyo-network/erc1967-witness'
export * from '@xyo-network/ethereum-blockchain-plugins'
export * from '@xyo-network/evm-abi-diviner'
export * from '@xyo-network/evm-call-witness'
export * from '@xyo-network/evm-contract-witness'

import { EthereumPlugins } from '@xyo-network/ethereum-blockchain-plugins'
import { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const EvmPlugins: PayloadSetPluginFunc[] = [...EthereumPlugins]

export default EvmPlugins
