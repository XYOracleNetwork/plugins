import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EvmAddress } from './Payload'
import { EvmAddressSchema } from './Schema'
import { addressPayloadTemplate } from './Template'

export const EvmAddressPayloadPlugin = () =>
  createPayloadPlugin<EvmAddress>({
    schema: EvmAddressSchema,
    template: addressPayloadTemplate,
  })
