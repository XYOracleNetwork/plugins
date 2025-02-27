import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources, PayloadWithOptionalSources, WithSources,
} from '@xyo-network/payload-model'

import { AmountFields } from '../../Amount/index.ts'

export const DiscountSchema = 'network.xyo.payments.discount' as const
export type DiscountSchema = typeof DiscountSchema

export interface DiscountFields extends AmountFields { }

/**
 * The result of a discount
 */
export type Discount = PayloadWithOptionalSources<DiscountFields, DiscountSchema>

/**
 * Identity function for determining if an object is an Discount
 */
export const isDiscount = isPayloadOfSchemaType<Discount>(DiscountSchema)
export const asDiscount = AsObjectFactory.create<Discount>(isDiscount)
export const asOptionalDiscount = AsObjectFactory.createOptional<Discount>(isDiscount)

/**
 * Identity function for determining if an object is an Discount with sources
 */
export const isDiscountWithSources = isPayloadOfSchemaTypeWithSources<Discount>(DiscountSchema)
export const asDiscountWithSources = AsObjectFactory.create<WithSources<Discount>>(isDiscountWithSources)
export const asOptionalDiscountWithSources = AsObjectFactory.createOptional<WithSources<Discount>>(isDiscountWithSources)
