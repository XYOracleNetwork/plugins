import { asSchema } from '@xyo-network/payload-model'

import { PaymentsSchema } from '../Schema.ts'

export const PaymentSchema = asSchema(`${PaymentsSchema}.payment`, true)
export type PaymentSchema = typeof PaymentSchema
