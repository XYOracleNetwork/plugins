import { AsObjectFactory } from '@xylabs/object'
import type { PayloadWithSources, WithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { AmountFields } from '../../Amount/index.ts'

export const TotalSchema = 'network.xyo.payments.total' as const
export type TotalSchema = typeof TotalSchema

export interface TotalFields extends AmountFields {}

/**
 * The result of a total
 */
export type Total = PayloadWithSources<TotalFields, TotalSchema>

/**
 * Identity function for determining if an object is an Total
 */
export const isTotal = isPayloadOfSchemaType<Total>(TotalSchema)
export const asTotal = AsObjectFactory.create<Total>(isTotal)
export const asOptionalTotal = AsObjectFactory.createOptional<Total>(isTotal)

/**
 * Identity function for determining if an object is an Total with sources
 */
export const isTotalWithSources = isPayloadOfSchemaTypeWithSources<Total>(TotalSchema)
export const asTotalWithSources = AsObjectFactory.create<WithSources<Total>>(isTotalWithSources)
export const asOptionalTotalWithSources = AsObjectFactory.createOptional<WithSources<Total>>(isTotalWithSources)
