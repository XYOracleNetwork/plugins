import { AsObjectFactory } from '@xylabs/object'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import {
  asSchema,
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../../Amount/index.ts'

export const DiscountSchema = asSchema('network.xyo.payments.discount', true)
export type DiscountSchema = typeof DiscountSchema

export interface DiscountFields extends AmountFields { }

/**
 * The result of a discount
 */
export type Discount = Payload<DiscountFields, DiscountSchema>

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
