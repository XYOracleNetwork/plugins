import { asSchema } from '@xyo-network/payload-model'

import { PaymentsSchema } from '../Schema.ts'

export const ReceiptSchema = asSchema(`${PaymentsSchema}.receipt`, true)
export type ReceiptSchema = typeof ReceiptSchema
