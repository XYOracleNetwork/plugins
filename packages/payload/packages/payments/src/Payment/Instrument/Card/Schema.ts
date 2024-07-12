import { PaymentInstrumentSchema } from '../Schema.js'

export const PaymentCardSchema = `${PaymentInstrumentSchema}.card`
export type PaymentCardSchema = typeof PaymentCardSchema
