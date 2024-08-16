import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { AddressTransactionHistoryPayload } from './Payload.ts'
import { AddressTransactionHistorySchema } from './Schema.ts'
import { addressTransactionHistoryPayloadTemplate } from './Template.ts'

export const AddressTransactionHistoryPayloadPlugin = () =>
  createPayloadPlugin<AddressTransactionHistoryPayload>({
    schema: AddressTransactionHistorySchema,
    template: addressTransactionHistoryPayloadTemplate,
  })
