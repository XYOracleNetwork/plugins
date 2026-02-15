import { AsObjectFactory } from '@xylabs/sdk-js'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import {
  asSchema, isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { DurationFields } from '../Duration/index.ts'
import type { DomainRegistrationFields } from './DomainRegistration.ts'
import { DomainRegistrationSchema } from './DomainRegistration.ts'

export const DomainRegistrationLeaseSchema = asSchema(`${DomainRegistrationSchema}.lease`, true)
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
export const asDomainRegistrationLease = AsObjectFactory.create<DomainRegistrationLease>(isDomainRegistrationLease)
export const asOptionalDomainRegistrationLease = AsObjectFactory.createOptional<DomainRegistrationLease>(isDomainRegistrationLease)

/**
 * Identity function for DomainRegistrationLease payload with sources
 */
export const isDomainRegistrationLeaseWithSources = isPayloadOfSchemaTypeWithSources<WithSources<DomainRegistrationLease>>(DomainRegistrationLeaseSchema)
export const asDomainRegistrationLeaseWithSources = AsObjectFactory.create<WithSources<DomainRegistrationLease>>(isDomainRegistrationLeaseWithSources)
export const asOptionalDomainRegistrationLeaseWithSources = AsObjectFactory
  .createOptional<WithSources<DomainRegistrationLease>>(isDomainRegistrationLeaseWithSources)

/**
 * @deprecated Use isDomainRegistrationLeaseWithSources instead
 */
export const isDomainRegistrationLeaseSources = isDomainRegistrationLeaseWithSources
