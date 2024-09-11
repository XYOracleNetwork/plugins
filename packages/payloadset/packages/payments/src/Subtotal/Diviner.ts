import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { HashLeaseEstimate, isHashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { DivinerInstance, DivinerModuleEventData } from '@xyo-network/diviner-model'
import { creatableModule } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload } from '@xyo-network/payload-model'
import {
  EscrowTerms, isEscrowTerms, PaymentSubtotalDivinerConfigSchema, PaymentSubtotalDivinerParams, Subtotal, SubtotalSchema,
} from '@xyo-network/payment-payload-plugins'

import {
  appraisalValidators, termsValidators, ValidEscrowTerms,
} from './lib/index.ts'

const currency = 'USD'

/**
 * Escrow terms that contain all the valid fields for calculating a subtotal
 */
export type PaymentSubtotalDivinerInputType = EscrowTerms | HashLeaseEstimate | Payload

@creatableModule()
export class PaymentSubtotalDiviner<
  TParams extends PaymentSubtotalDivinerParams = PaymentSubtotalDivinerParams,
  TIn extends PaymentSubtotalDivinerInputType = PaymentSubtotalDivinerInputType,
  TOut extends Subtotal = Subtotal,
  TEventData extends DivinerModuleEventData<DivinerInstance<TParams, TIn, TOut>, TIn, TOut> = DivinerModuleEventData<
    DivinerInstance<TParams, TIn, TOut>,
    TIn,
    TOut
  >,
> extends AbstractDiviner<TParams, TIn, TOut, TEventData> {
  static override configSchemas = [PaymentSubtotalDivinerConfigSchema]
  static override defaultConfigSchema = PaymentSubtotalDivinerConfigSchema

  protected async divineHandler(payloads: TIn[] = []): Promise<TOut[]> {
    // Find the escrow terms
    const terms = payloads.find(isEscrowTerms) as EscrowTerms | undefined
    if (!terms) return []

    // Run all terms validations
    if (!termsValidators.every(validator => validator(terms))) return []
    const validTerms = terms as ValidEscrowTerms

    // Retrieve all appraisals from terms
    const hashMap = await PayloadBuilder.toAllHashMap(payloads)
    const appraisals = validTerms.appraisals.map(appraisal => hashMap[appraisal]).filter(isHashLeaseEstimate) as unknown as HashLeaseEstimate[]

    // Ensure all appraisals are present
    if (appraisals.length !== validTerms.appraisals.length) return []

    // Run all appraisal validations
    if (!appraisalValidators.every(validator => validator(appraisals))) return []
    const amount = calculateSubtotal(appraisals)
    const sources = [await PayloadBuilder.dataHash(validTerms), ...validTerms.appraisals]
    return [{
      amount, currency, schema: SubtotalSchema, sources,
    }] as TOut[]
  }
}

// TODO: Add support for other currencies
const calculateSubtotal = (appraisals: HashLeaseEstimate[]): number => {
  return appraisals.reduce((sum, appraisal) => sum + appraisal.price, 0)
}
