import type { EthereumGasEtherchainV2Payload } from '@xyo-network/etherchain-gas-ethereum-blockchain-payload-plugins'
import { EthereumGasEtherchainV2Schema } from '@xyo-network/etherchain-gas-ethereum-blockchain-payload-plugins'
import type { Payload } from '@xyo-network/payload-model'

export const isEthereumGasEtherchainV2Payload = (payload?: Payload | null): payload is EthereumGasEtherchainV2Payload => {
  return payload?.schema === EthereumGasEtherchainV2Schema
}
