import '@xylabs/vitest-extended'

import { assertEx } from '@xylabs/assert'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { BoundWitnessDivinerConfigSchema } from '@xyo-network/diviner-boundwitness-model'
import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { HashLeaseEstimateSchema } from '@xyo-network/diviner-hash-lease'
import { MemoryNode } from '@xyo-network/node-memory'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { EscrowTerms } from '@xyo-network/payment-payload-plugins'
import { EscrowTermsSchema, NO_DISCOUNT } from '@xyo-network/payment-payload-plugins'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { PaymentDiscountDiviner } from '../../Discount/index.ts'
import { PaymentSubtotalDiviner } from '../../Subtotal/index.ts'
import { PaymentTotalDiviner } from '../../Total/index.ts'
import { getInvoiceForEscrow } from '../getInvoiceForEscrow.ts'

describe('getInvoiceForEscrow', () => {
  let node: MemoryNode
  let paymentTotalDiviner: PaymentTotalDiviner
  beforeAll(async () => {
    node = await MemoryNode.create({ account: 'random' })
    const discountsArchivist = await MemoryArchivist.create({ account: 'random' })
    const discountsBoundWitnessDiviner = await MemoryBoundWitnessDiviner.create({
      account: 'random',
      config: { archivist: discountsArchivist.address, schema: BoundWitnessDivinerConfigSchema },
    })
    const paymentDiscountDiviner = await PaymentDiscountDiviner.create({
      account: 'random',
      config: {
        archivist: discountsArchivist.address,
        boundWitnessDiviner: discountsBoundWitnessDiviner.address,
        schema: PaymentDiscountDiviner.defaultConfigSchema,
      },
    })
    const paymentSubtotalDiviner = await PaymentSubtotalDiviner.create({ account: 'random' })
    paymentTotalDiviner = await PaymentTotalDiviner.create({
      account: 'random',
      config: {
        paymentDiscountDiviner: paymentDiscountDiviner.address,
        paymentSubtotalDiviner: paymentSubtotalDiviner.address,
        schema: PaymentTotalDiviner.defaultConfigSchema,
      },
    })
    const modules = [
      discountsArchivist,
      discountsBoundWitnessDiviner,
      paymentDiscountDiviner,
      paymentSubtotalDiviner,
      paymentTotalDiviner]
    for (const module of modules) {
      await node.register(module)
      await node.attach(module.address, true)
    }
  })
  describe('with no discount', () => {
    it('should return invoice values', async () => {
      const nbf = Date.now()
      const exp = nbf + 1000 * 60 * 10
      const appraisal: HashLeaseEstimate = {
        price: 10, currency: 'USD', schema: HashLeaseEstimateSchema, exp, nbf,
      }
      const appraisalHash = await PayloadBuilder.dataHash(appraisal)
      const terms: EscrowTerms = {
        schema: EscrowTermsSchema, appraisals: [appraisalHash], exp, nbf,
      }
      const dataHashMap = await PayloadBuilder.toDataHashMap([appraisal])
      const result = await getInvoiceForEscrow(terms, dataHashMap, paymentTotalDiviner)
      expect(result).toBeArray()
      expect(result?.length).toBeGreaterThan(0)
      const invoice = assertEx(result)
      const [subtotal, total, payment, discount] = invoice
      expect(subtotal).toBeDefined()
      expect(subtotal.amount).toBeNumber()
      expect(subtotal.amount).toBe(appraisal.price)
      expect(subtotal.currency).toBe('USD')
      expect(total).toBeDefined()
      expect(total.amount).toBeNumber()
      expect(total.amount).toBe(subtotal.amount)
      expect(total.currency).toBe('USD')
      expect(payment).toBeDefined()
      expect(payment.amount).toBeNumber()
      expect(payment.amount).toBe(total.amount)
      expect(payment.currency).toBe('USD')
      expect(discount).toBeDefined()
      expect(discount).toMatchObject(NO_DISCOUNT)
    })
  })
})
