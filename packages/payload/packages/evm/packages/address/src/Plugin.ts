import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EvmAddress } from './Payload.js'
import { EvmAddressSchema } from './Schema.js'
import { addressPayloadTemplate } from './Template.js'

export const EvmAddressPayloadPlugin = () =>
  createPayloadPlugin<EvmAddress>({
    schema: EvmAddressSchema,
    template: addressPayloadTemplate,
  })
