import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../Amount/index.ts'

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

/**
 * Identity function for determining if an object is an Subtotal with sources
 */
export const isSubtotalWithSources = isPayloadOfSchemaTypeWithSources<Subtotal>(SubtotalSchema)

/**
 * Identity function for determining if an object is an Subtotal with meta
 */
export const isSubtotalWithMeta = isPayloadOfSchemaTypeWithMeta<Subtotal>(SubtotalSchema)
