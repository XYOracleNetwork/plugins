import type { PayloadWithSources } from '@xyo-network/payload-model'
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

/**
 * Identity function for determining if an object is an Total with sources
 */
export const isTotalWithSources = isPayloadOfSchemaTypeWithSources<Total>(TotalSchema)
