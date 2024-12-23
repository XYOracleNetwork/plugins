import { AsObjectFactory } from '@xylabs/object'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

import type { DurationFields } from '../Duration/index.ts'
import type { DomainFields } from './Domain.ts'

export type DomainLeaseSchema = 'network.xyo.ns.domain.lease'
export const DomainLeaseSchema: DomainLeaseSchema = 'network.xyo.ns.domain.lease'

/**
 * A domain is leased for a duration
 */
export interface DomainLeaseFields extends DomainFields, DurationFields {}

/**
 * A domain lease is a record of a domain and the duration it is leased for
 */
export type DomainLease = Payload<DomainLeaseFields, DomainLeaseSchema>

/**
 * Identity function for DomainLease payload
 */
export const isDomainLease = isPayloadOfSchemaType<DomainLease>(DomainLeaseSchema)
export const asDomainLease = AsObjectFactory.create<DomainLease>(isDomainLease)
export const asOptionalDomainLease = AsObjectFactory.createOptional<DomainLease>(isDomainLease)

/**
 * Identity function for DomainLease payload with sources
 */
export const isDomainLeaseWithSources = isPayloadOfSchemaTypeWithSources<WithSources<DomainLease>>(DomainLeaseSchema)
export const asDomainLeaseWithSources = AsObjectFactory.create<WithSources<DomainLease>>(isDomainLeaseWithSources)
export const asOptionalDomainLeaseWithSources = AsObjectFactory.createOptional<WithSources<DomainLease>>(isDomainLeaseWithSources)
