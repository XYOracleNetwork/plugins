import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { UtmSchema } from './Schema.ts'

/**
 * The fields of a Utm payload
 */
export interface UtmFields {
  /**
   * Names the specific campaign for tracking purposes (e.g., summer_sale, launch_campaign).
  */
  utm_campaign?: string
  /**
   * Differentiates similar content or links within the same ad (useful for A/B testing).
   */
  utm_content?: string
  /**
  * Indicates the medium, like email, cost-per-click (cpc), or social.
  */
  utm_medium?: string
  /**
  * Identifies the source of the traffic (e.g., Google, Facebook, newsletter).
  */
  utm_source?: string
  /**
   * Used to track specific keywords for paid search campaigns.
   */
  utm_term?: string
}

/**
 * The fields of a Utm payload
 */
export type Utm = PayloadWithSources<UtmFields, UtmSchema>

/**
 * Identity function for determining if an object is a Utm payload
 */
export const isUtm = isPayloadOfSchemaType<Utm>(UtmSchema)

/**
 * Identity function for determining if an object is a Utm payload with sources
 */
export const isUtmWithSources = isPayloadOfSchemaTypeWithSources<Utm>(UtmSchema)

/**
 * Identity function for determining if an object is a Utm payload with meta
 */
export const isUtmWithMeta = isPayloadOfSchemaTypeWithMeta<Utm>(UtmSchema)
