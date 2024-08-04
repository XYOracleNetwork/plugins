import { PaymentSchema } from '../Schema.ts'

export const PaymentInstrumentSchema = `${PaymentSchema}.instrument`
export type PaymentInstrumentSchema = typeof PaymentInstrumentSchema
