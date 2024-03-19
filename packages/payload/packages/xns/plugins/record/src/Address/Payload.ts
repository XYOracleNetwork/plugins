import { Address } from '@xylabs/hex'
import { isPayloadOfSchemaType, Payload, WithMeta } from '@xyo-network/payload-model'

import { DomainFields } from '../Domain'

export type AddressRecordSchema = 'network.xyo.ns.record.address'
export const AddressRecordSchema: AddressRecordSchema = 'network.xyo.ns.record.address'

export interface AddressRecordFields extends DomainFields {
  /**
   * The address the record points to
   */
  address: Address[]
}

/**
 * An address record points a domain to an address
 */
export type AddressRecord = Payload<AddressRecordFields, AddressRecordSchema>

export const isAddressRecord = isPayloadOfSchemaType<AddressRecord>(AddressRecordSchema)
export const isAddressRecordWithMeta = isPayloadOfSchemaType<WithMeta<AddressRecord>>(AddressRecordSchema)
