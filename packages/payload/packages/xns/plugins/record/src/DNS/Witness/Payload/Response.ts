import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { DNSResponseFields } from '../../types/index.ts'
import { DNSSchema } from '../Schema.ts'

/**
 * The fields of a DNSResponse payload
 */
export type DNSResponse = PayloadWithSources<DNSResponseFields, DNSSchema>

/**
 * Identity function for determining if an object is a DNSResponse payload
 */
export const isDNSResponse = isPayloadOfSchemaType<DNSResponse>(DNSSchema)

/**
 * Identity function for determining if an object is a DNSResponse payload with sources
 */
export const isDNSResponseWithSources = isPayloadOfSchemaTypeWithSources<DNSResponse>(DNSSchema)

/**
 * Identity function for determining if an object is a DNSResponse payload with meta
 */
export const isDNSResponseWithMeta = isPayloadOfSchemaTypeWithMeta<DNSResponse>(DNSSchema)
