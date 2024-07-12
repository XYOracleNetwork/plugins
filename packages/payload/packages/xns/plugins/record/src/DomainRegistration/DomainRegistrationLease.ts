import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources, Payload } from '@xyo-network/payload-model'

import { DurationFields } from '../Duration/index.js'
import { DomainRegistrationFields, DomainRegistrationSchema } from './DomainRegistration.js'

export const DomainRegistrationLeaseSchema = `${DomainRegistrationSchema}.lease` as const
export type DomainRegistrationLeaseSchema = typeof DomainRegistrationLeaseSchema

export interface DomainRegistrationLeaseFields extends DomainRegistrationFields, DurationFields {}

/**
 * Temporal delegation of a domain to a registrar by a registrant
 */
export type DomainRegistrationLease = Payload<DomainRegistrationLeaseFields, DomainRegistrationLeaseSchema>

/**
 * Identity function for DomainRegistrationLease payload
 */
export const isDomainRegistrationLease = isPayloadOfSchemaType<DomainRegistrationLease>(DomainRegistrationLeaseSchema)

/**
 * Identity function for DomainRegistrationLease payload with sources
 */
export const isDomainRegistrationLeaseSources = isPayloadOfSchemaTypeWithSources<DomainRegistrationLease>(DomainRegistrationLeaseSchema)

/**
 * Identity function for DomainRegistrationLease payload with meta
 */
export const isDomainRegistrationLeaseMeta = isPayloadOfSchemaTypeWithMeta<DomainRegistrationLease>(DomainRegistrationLeaseSchema)
