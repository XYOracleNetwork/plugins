import { asSchema } from '@xyo-network/payload-model'

import { PaymentInstrumentSchema } from '../Schema.ts'

export const PaymentCardSchema = asSchema(`${PaymentInstrumentSchema}.card`, true)
export type PaymentCardSchema = typeof PaymentCardSchema
