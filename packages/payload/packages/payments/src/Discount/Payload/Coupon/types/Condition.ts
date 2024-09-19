import {
  isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources, type WithMeta, type WithOptionalMeta,
} from '@xyo-network/payload-model'
import { type SchemaPayload, SchemaSchema } from '@xyo-network/schema-payload-plugin'

/**
 * The payloads that can be used as conditions for a coupon
 */
export type Condition = SchemaPayload | WithOptionalMeta<SchemaPayload> | WithMeta<SchemaPayload>

/**
 * Identity function for determining if an object is a Condition payload
 */
export const isCondition = isPayloadOfSchemaType<Condition>(SchemaSchema)

/**
 * Identity function for determining if an object is a Condition payload with sources
 */
export const isConditionWithSources = isPayloadOfSchemaTypeWithSources<Condition>(SchemaSchema)

/**
 * Identity function for determining if an object is a Condition payload with meta
 */
export const isConditionWithMeta = isPayloadOfSchemaTypeWithMeta<Condition>(SchemaSchema)
