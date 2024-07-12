import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { AddressTransactionHistoryPayload } from './Payload.js'
import { AddressTransactionHistorySchema } from './Schema.js'
import { addressTransactionHistoryPayloadTemplate } from './Template.js'

export const AddressTransactionHistoryPayloadPlugin = () =>
  createPayloadPlugin<AddressTransactionHistoryPayload>({
    schema: AddressTransactionHistorySchema,
    template: addressTransactionHistoryPayloadTemplate,
  })
