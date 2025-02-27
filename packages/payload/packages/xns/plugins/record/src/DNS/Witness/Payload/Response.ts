import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources, PayloadWithSources, WithSources,
} from '@xyo-network/payload-model'

import { DNSResponseFields } from '../../types/index.ts'
import { DNSSchema } from '../Schema.ts'

/**
 * The fields of a DNSResponse payload
 */
export type DNSResponse = PayloadWithSources<DNSResponseFields, DNSSchema>

/**
 * Identity function for determining if an object is a DNSResponse payload
 */
export const isDNSResponse = isPayloadOfSchemaType<DNSResponse>(DNSSchema)
export const asDNSResponse = AsObjectFactory.create<DNSResponse>(isDNSResponse)
export const asOptionalDNSResponse = AsObjectFactory.createOptional<DNSResponse>(isDNSResponse)

/**
 * Identity function for determining if an object is a DNSResponse payload with sources
 */
export const isDNSResponseWithSources = isPayloadOfSchemaTypeWithSources<DNSResponse>(DNSSchema)
export const asDNSResponseWithSources = AsObjectFactory.create<WithSources<DNSResponse>>(isDNSResponseWithSources)
export const asOptionalDNSResponseWithSources = AsObjectFactory.createOptional<WithSources<DNSResponse>>(isDNSResponseWithSources)
