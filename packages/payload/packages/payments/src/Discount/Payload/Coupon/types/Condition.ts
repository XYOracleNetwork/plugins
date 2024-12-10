import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'
import { type SchemaPayload, SchemaSchema } from '@xyo-network/schema-payload-plugin'

/**
 * The payloads that can be used as conditions for a coupon
 */
export type Condition = SchemaPayload

/**
 * Identity function for determining if an object is a Condition payload
 */
export const isCondition = isPayloadOfSchemaType<Condition>(SchemaSchema)

/**
 * Identity function for determining if an object is a Condition payload with sources
 */
export const isConditionWithSources = isPayloadOfSchemaTypeWithSources<Condition>(SchemaSchema)
