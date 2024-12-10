import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../../Amount/index.ts'

export const DiscountSchema = 'network.xyo.payments.discount' as const
export type DiscountSchema = typeof DiscountSchema

export interface DiscountFields extends AmountFields { }

/**
 * The result of a discount
 */
export type Discount = PayloadWithSources<DiscountFields, DiscountSchema>

/**
 * Identity function for determining if an object is an Discount
 */
export const isDiscount = isPayloadOfSchemaType<Discount>(DiscountSchema)

/**
 * Identity function for determining if an object is an Discount with sources
 */
export const isDiscountWithSources = isPayloadOfSchemaTypeWithSources<Discount>(DiscountSchema)
