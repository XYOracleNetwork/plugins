import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

import type { DurationFields } from '../Duration/index.ts'
import type { DomainRegistrationFields } from './DomainRegistration.ts'
import { DomainRegistrationSchema } from './DomainRegistration.ts'

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
export const isDomainRegistrationLeaseWithSources = isPayloadOfSchemaTypeWithSources<DomainRegistrationLease>(DomainRegistrationLeaseSchema)
/**
 * @deprecated Use isDomainRegistrationLeaseWithSources instead
 */
export const isDomainRegistrationLeaseSources = isDomainRegistrationLeaseWithSources

/**
 * Identity function for DomainRegistrationLease payload with meta
 */
export const isDomainRegistrationLeaseWithMeta = isPayloadOfSchemaTypeWithMeta<DomainRegistrationLease>(DomainRegistrationLeaseSchema)
/**
 * @deprecated Use isDomainRegistrationLeaseWithMeta instead
 */
export const isDomainRegistrationLeaseMeta = isDomainRegistrationLeaseWithMeta
