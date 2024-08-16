import type { EthereumGasEthersPayload } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import { EthereumGasEthersSchema } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'

export const isEthereumGasEthersPayload = (payload?: Payload | null): payload is EthereumGasEthersPayload => {
  return payload?.schema === EthereumGasEthersSchema
}
