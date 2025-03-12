import type { EthereumGasEtherscanPayload } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import { EthereumGasEtherscanSchema } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'

export const isEthereumGasEtherscanPayload = (payload?: Payload | null): payload is EthereumGasEtherscanPayload => {
  return payload?.schema === EthereumGasEtherscanSchema
}
