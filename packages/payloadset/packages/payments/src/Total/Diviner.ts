import { assertEx, Hash } from '@xylabs/sdk-js'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import {
  asDivinerInstance, DivinerInstance, DivinerModuleEventData,
} from '@xyo-network/diviner-model'
import { creatableModule } from '@xyo-network/module-model'
import {
  Discount,
  isDiscount,
  isSubtotal,
  PaymentTotalDivinerConfigSchema, PaymentTotalDivinerParams, Subtotal, Total, TotalSchema,
} from '@xyo-network/payment-payload-plugins'
import { PayloadBuilder } from '@xyo-network/sdk-js'

import { PaymentDiscountDiviner, PaymentDiscountDivinerInputType } from '../Discount/index.ts'
import { PaymentSubtotalDiviner, PaymentSubtotalDivinerInputType } from '../Subtotal/index.ts'

type InputType = PaymentDiscountDivinerInputType | PaymentSubtotalDivinerInputType
type OutputType = Subtotal | Discount | Total

@creatableModule()
export class PaymentTotalDiviner<
  TParams extends PaymentTotalDivinerParams = PaymentTotalDivinerParams,
  TIn extends InputType = InputType,
  TOut extends OutputType = OutputType,
  TEventData extends DivinerModuleEventData<DivinerInstance<TParams, TIn, TOut>, TIn, TOut> = DivinerModuleEventData<
    DivinerInstance<TParams, TIn, TOut>,
    TIn,
    TOut
  >,
> extends AbstractDiviner<TParams, TIn, TOut, TEventData> {
  static override readonly configSchemas = [PaymentTotalDivinerConfigSchema]
  static override readonly defaultConfigSchema: PaymentTotalDivinerConfigSchema = PaymentTotalDivinerConfigSchema

  protected async divineHandler(payloads: TIn[] = []): Promise<TOut[]> {
    const subtotalDiviner = await this.getPaymentSubtotalDiviner()
    const subtotalResult = await subtotalDiviner.divine(payloads)
    const subtotal = subtotalResult.find(isSubtotal)
    if (!subtotal) return []
    const discountDiviner = await this.getPaymentDiscountsDiviner()
    const discountResult = await discountDiviner.divine(payloads)
    const discount = discountResult.find(isDiscount)
    if (!discount) return []
    const { currency: subtotalCurrency } = subtotal
    const { currency: discountCurrency } = discount
    assertEx(subtotalCurrency === discountCurrency, () => `Subtotal currency ${subtotalCurrency} does not match discount currency ${discountCurrency}`)
    const amount = Math.max(0, subtotal.amount - discount.amount)
    const currency = subtotalCurrency
    const $sources = [await PayloadBuilder.dataHash(subtotal), await PayloadBuilder.dataHash(discount)] as Hash[]
    const total: Total = {
      amount, currency, $sources, schema: TotalSchema,
    }
    return [subtotal, discount, total] as TOut[]
  }

  protected async getPaymentDiscountsDiviner(): Promise<PaymentDiscountDiviner> {
    const name = assertEx(this.config.paymentDiscountDiviner, () => 'Missing paymentDiscountDiviner in config')
    const mod = assertEx(await this.resolve(name), () => `Error resolving paymentDiscountDiviner: ${name}`)
    return assertEx(asDivinerInstance(mod), () => `Resolved module ${mod.address} not a valid Diviner`) as PaymentDiscountDiviner
  }

  protected async getPaymentSubtotalDiviner(): Promise<PaymentSubtotalDiviner> {
    const name = assertEx(this.config.paymentSubtotalDiviner, () => 'Missing paymentSubtotalDiviner in config')
    const mod = assertEx(await this.resolve(name), () => `Error resolving paymentSubtotalDiviner: ${name}`)
    return assertEx(asDivinerInstance(mod), () => `Resolved module ${mod.address} not a valid Diviner`) as PaymentSubtotalDiviner
  }
}
