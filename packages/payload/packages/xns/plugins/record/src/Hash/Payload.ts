import type { Hash } from '@xylabs/hex'
import type { Payload, WithMeta } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import type { DomainFields } from '../Domain/index.ts'

export type HashRecordSchema = 'network.xyo.ns.record.hash'
export const HashRecordSchema: HashRecordSchema = 'network.xyo.ns.record.hash'

export interface HashRecordFields extends DomainFields {
  /**
   * The hash the record points to
   */
  hash: Hash[]
}

/**
 * An hash record points a domain to an hash
 */
export type HashRecord = Payload<HashRecordFields, HashRecordSchema>

export const isHashRecord = isPayloadOfSchemaType<HashRecord>(HashRecordSchema)
export const isHashRecordWithMeta = isPayloadOfSchemaType<WithMeta<HashRecord>>(HashRecordSchema)
