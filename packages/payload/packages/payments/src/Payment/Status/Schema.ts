import { asSchema } from '@xyo-network/payload-model'

import { PaymentSchema } from '../Schema.ts'

export const PaymentStatusSchema = asSchema(`${PaymentSchema}.status`, true)
export type PaymentStatusSchema = typeof PaymentStatusSchema
