import type { EthereumGasEthgasstationPayload } from '@xyo-network/ethgasstation-ethereum-gas-payload-plugin'
import { EthereumGasEthgasstationSchema } from '@xyo-network/ethgasstation-ethereum-gas-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'

export const isEthereumGasEthgasstationPayload = (payload?: Payload | null): payload is EthereumGasEthgasstationPayload => {
  return payload?.schema === EthereumGasEthgasstationSchema
}
