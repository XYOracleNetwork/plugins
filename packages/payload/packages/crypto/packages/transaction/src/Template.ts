import { AddressTransactionHistoryPayload } from './Payload.js'
import { AddressTransactionHistorySchema } from './Schema.js'

export const addressTransactionHistoryPayloadTemplate = (): Partial<AddressTransactionHistoryPayload> => ({
  schema: AddressTransactionHistorySchema,
})
