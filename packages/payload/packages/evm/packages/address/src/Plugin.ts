import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { EvmAddress } from './Payload.ts'
import { EvmAddressSchema } from './Schema.ts'
import { addressPayloadTemplate } from './Template.ts'

export const EvmAddressPayloadPlugin = () =>
  createPayloadPlugin<EvmAddress>({
    schema: EvmAddressSchema,
    template: addressPayloadTemplate,
  })
