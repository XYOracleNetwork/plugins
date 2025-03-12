import type { EthereumGasBlocknativePayload } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import { EthereumGasBlocknativeSchema } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'

export const isEthereumGasBlocknativePayload = (payload?: Payload | null): payload is EthereumGasBlocknativePayload => {
  return payload?.schema === EthereumGasBlocknativeSchema
}
