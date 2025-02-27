import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources, PayloadWithOptionalSources, WithSources,
} from '@xyo-network/payload-model'

import {
  DNSRequestFields, DNSResourceRecordTypes, DNSResourceRecordTypeValue, getRequestFor,
} from '../../types/index.ts'
import { DNSSchema } from '../Schema.ts'

/**
 * The fields of a DNSRequest payload
 */
export type DNSRequest = PayloadWithOptionalSources<DNSRequestFields, DNSSchema>

/**
 * Identity function for determining if an object is a DNSRequest payload
 */
export const isDNSRequest = isPayloadOfSchemaType<DNSRequest>(DNSSchema)
export const asDNSRequest = AsObjectFactory.create<DNSRequest>(isDNSRequest)
export const asOptionalDNSRequest = AsObjectFactory.createOptional<DNSRequest>(isDNSRequest)

/**
 * Identity function for determining if an object is a DNSRequest payload with sources
 */
export const isDNSRequestWithSources = isPayloadOfSchemaTypeWithSources<WithSources<DNSRequest>>(DNSSchema)
export const asDNSRequestWithSources = AsObjectFactory.create<WithSources<DNSRequest>>(isDNSRequestWithSources)
export const asOptionalDNSRequestWithSources = AsObjectFactory.createOptional<WithSources<DNSRequest>>(isDNSRequestWithSources)

/**
 * Helper for generating a DNSRequest payload for a given domain and record type
 * @param domain The domain to query
 * @param type The record type to query
 * @returns A DNSRequest payload
 */
export const getDnsRequestFor = (domain: string, type: DNSResourceRecordTypeValue = DNSResourceRecordTypes.A): DNSRequest => {
  return { ...getRequestFor(domain, type), schema: DNSSchema }
}
