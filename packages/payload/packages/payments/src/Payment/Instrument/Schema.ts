import { PaymentSchema } from '../Schema.js'

export const PaymentInstrumentSchema = `${PaymentSchema}.instrument`
export type PaymentInstrumentSchema = typeof PaymentInstrumentSchema
