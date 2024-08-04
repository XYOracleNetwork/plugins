import { PaymentInstrumentSchema } from '../Schema.ts'

export const PaymentCardSchema = `${PaymentInstrumentSchema}.card`
export type PaymentCardSchema = typeof PaymentCardSchema
