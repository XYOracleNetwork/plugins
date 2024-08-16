export * from '@xyo-network/etherchain-gas-ethereum-blockchain-payload-plugins'
export * from '@xyo-network/etherscan-ethereum-gas-payload-plugin'

import { EthereumGasEtherchainPayloadPlugins } from '@xyo-network/etherchain-gas-ethereum-blockchain-payload-plugins'
import { EthereumGasEtherscanPayloadPlugin } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const EthereumGasPayloadPlugins: PayloadPluginFunc[] = [...EthereumGasEtherchainPayloadPlugins, EthereumGasEtherscanPayloadPlugin]

// eslint-disable-next-line import-x/no-default-export
export default EthereumGasPayloadPlugins
