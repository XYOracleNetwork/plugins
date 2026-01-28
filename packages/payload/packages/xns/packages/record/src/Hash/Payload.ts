import type { Hash } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'
import { asSchema, isPayloadOfSchemaType } from '@xyo-network/payload-model'

import type { DomainFields } from '../Domain/index.ts'

export type HashRecordSchema = typeof HashRecordSchema
export const HashRecordSchema = asSchema('network.xyo.ns.record.hash', true)

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
