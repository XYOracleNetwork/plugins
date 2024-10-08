import { EthereumGasEtherchainV2Plugin } from '@xyo-network/etherchain-ethereum-gas-v2-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export * from '@xyo-network/etherchain-ethereum-gas-v2-plugin'

export const EthereumGasEtherchainPlugins: PayloadSetPluginFunc[] = [EthereumGasEtherchainV2Plugin]

// eslint-disable-next-line import-x/no-default-export
export default EthereumGasEtherchainPlugins
