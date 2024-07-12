import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasEtherchainV2Payload } from './Payload.js'
import { EthereumGasEtherchainV2Schema } from './Schema.js'

export const EthereumGasEtherchainV2PayloadPlugin = () =>
  createPayloadPlugin<EthereumGasEtherchainV2Payload>({
    schema: EthereumGasEtherchainV2Schema,
  })
