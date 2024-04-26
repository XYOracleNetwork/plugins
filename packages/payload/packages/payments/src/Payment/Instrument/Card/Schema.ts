import { PaymentInstrumentSchema } from '../Schema'

export const PaymentCardSchema = `${PaymentInstrumentSchema}.card`
export type PaymentCardSchema = typeof PaymentCardSchema
