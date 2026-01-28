import type { Address } from '@xylabs/hex'
import { AsObjectFactory } from '@xylabs/object'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import {
  asSchema, isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { DomainFields } from '../Domain/index.ts'
import { DomainSchema } from '../Domain/index.ts'

export const DomainRegistrationSchema = asSchema(`${DomainSchema}.registration`, true)
export type DomainRegistrationSchema = typeof DomainRegistrationSchema

export interface DomainRegistrationFields extends DomainFields {
  /**
   * The registrant of the domain
   */
  registrant: Address[]
  /**
   * The registrar of the domain
   */
  registrar: Address[]
}

/**
 * Delegation of a domain to a registrar by a registrant
 */
export type DomainRegistration = Payload<DomainRegistrationFields, DomainRegistrationSchema>

/**
 * Identity function for DomainRegistration payload
 */
export const isDomainRegistration = isPayloadOfSchemaType<DomainRegistration>(DomainRegistrationSchema)
export const asDomainRegistration = AsObjectFactory.create<DomainRegistration>(isDomainRegistration)
export const asOptionalDomainRegistration = AsObjectFactory.createOptional<DomainRegistration>(isDomainRegistration)

/**
 * Identity function for DomainRegistration payload with sources
 */
export const isDomainRegistrationWithSources = isPayloadOfSchemaTypeWithSources<WithSources<DomainRegistration>>(DomainRegistrationSchema)
export const asDomainRegistrationWithSources = AsObjectFactory.create<WithSources<DomainRegistration>>(isDomainRegistrationWithSources)
export const asOptionalDomainRegistrationWithSources = AsObjectFactory.createOptional<WithSources<DomainRegistration>>(isDomainRegistrationWithSources)
