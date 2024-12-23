import { EthereumGasEtherchainV2Plugin } from '@xyo-network/etherchain-ethereum-gas-v2-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export * from '@xyo-network/etherchain-ethereum-gas-v2-plugin'

export const EthereumGasEtherchainPlugins: PayloadSetPluginFunc[] = [EthereumGasEtherchainV2Plugin]

export default EthereumGasEtherchainPlugins
