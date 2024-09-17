import { assertEx } from '@xylabs/assert'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, WithMeta } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'
import type { Coupon } from '@xyo-network/payment-payload-plugins'
import type { SchemaPayload } from '@xyo-network/schema-payload-plugin'
import { SchemaSchema } from '@xyo-network/schema-payload-plugin'

// TODO: Migrate to and pull from core SDK
/**
 * Identity function for determining if an object is an Schema
 */
export const isSchema = isPayloadOfSchemaType<SchemaPayload>(SchemaSchema)

/**
 * Identity function for determining if an object is an Schema with sources
 */
export const isSchemaWithSources = isPayloadOfSchemaTypeWithSources<SchemaPayload>(SchemaSchema)

/**
 * Identity function for determining if an object is an Schema with meta
 */
export const isSchemaWithMeta = isPayloadOfSchemaTypeWithMeta<SchemaPayload>(SchemaSchema)

export const areConditionsFulfilled = async (coupon: Coupon, payloads: Payload[]): Promise<boolean> => {
  // If there are no conditions, then they are fulfilled
  if (!coupon.conditions || coupon.conditions.length === 0) return true
  const hashMap = await PayloadBuilder.toAllHashMap(payloads)
  // Find all the conditions
  const conditions = coupon.conditions.map(hash => hashMap[hash]).filter(isSchemaWithMeta) as WithMeta<SchemaPayload>[]
  assertEx(conditions.length === coupon.conditions.length, () => 'Not all conditions were found')
  // TODO: Implement condition fulfillment
  return false
}
