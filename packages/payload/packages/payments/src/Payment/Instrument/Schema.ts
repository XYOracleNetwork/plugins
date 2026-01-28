import { asSchema } from '@xyo-network/payload-model'

import { PaymentSchema } from '../Schema.ts'

export const PaymentInstrumentSchema = asSchema(`${PaymentSchema}.instrument`, true)
export type PaymentInstrumentSchema = typeof PaymentInstrumentSchema
