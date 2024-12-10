import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { DNSRequestFields, DNSResourceRecordTypeValue } from '../../types/index.ts'
import { DNSResourceRecordTypes, getRequestFor } from '../../types/index.ts'
import { DNSSchema } from '../Schema.ts'

/**
 * The fields of a DNSRequest payload
 */
export type DNSRequest = PayloadWithSources<DNSRequestFields, DNSSchema>

/**
 * Identity function for determining if an object is a DNSRequest payload
 */
export const isDNSRequest = isPayloadOfSchemaType<DNSRequest>(DNSSchema)

/**
 * Identity function for determining if an object is a DNSRequest payload with sources
 */
export const isDNSRequestWithSources = isPayloadOfSchemaTypeWithSources<DNSRequest>(DNSSchema)

/**
 * Helper for generating a DNSRequest payload for a given domain and record type
 * @param domain The domain to query
 * @param type The record type to query
 * @returns A DNSRequest payload
 */
export const getDnsRequestFor = (domain: string, type: DNSResourceRecordTypeValue = DNSResourceRecordTypes.A): DNSRequest => {
  return { ...getRequestFor(domain, type), schema: DNSSchema }
}
