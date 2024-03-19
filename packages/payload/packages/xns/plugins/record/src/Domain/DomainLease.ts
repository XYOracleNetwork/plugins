import { Payload } from '@xyo-network/payload-model'

import { DurationFields } from '../../Duration'
import { DomainFields } from './Domain'

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
