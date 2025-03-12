import type { Address } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import type { DomainFields } from '../Domain/index.ts'

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
