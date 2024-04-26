import { PaymentSchema } from '../Schema'

export const PaymentInstrumentSchema = `${PaymentSchema}.instrument`
export type PaymentInstrumentSchema = typeof PaymentInstrumentSchema
