import { AsObjectFactory } from '@xylabs/object'
import type { PayloadWithSources, WithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../../Amount/index.ts'

export const SubtotalSchema = 'network.xyo.payments.subtotal' as const
export type SubtotalSchema = typeof SubtotalSchema

export interface SubtotalFields extends AmountFields {}

/**
 * The result of a subtotal
 */
export type Subtotal = PayloadWithSources<SubtotalFields, SubtotalSchema>

/**
 * Identity function for determining if an object is an Subtotal
 */
export const isSubtotal = isPayloadOfSchemaType<Subtotal>(SubtotalSchema)
export const asSubtotal = AsObjectFactory.create<Subtotal>(isSubtotal)
export const asOptionalSubtotal = AsObjectFactory.createOptional<Subtotal>(isSubtotal)

/**
 * Identity function for determining if an object is an Subtotal with sources
 */
export const isSubtotalWithSources = isPayloadOfSchemaTypeWithSources<Subtotal>(SubtotalSchema)
export const asSubtotalWithSources = AsObjectFactory.create<WithSources<Subtotal>>(isSubtotalWithSources)
export const asOptionalSubtotalWithSources = AsObjectFactory.createOptional<WithSources<Subtotal>>(isSubtotalWithSources)
