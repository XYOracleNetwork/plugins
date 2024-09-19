import type { Address } from '@xylabs/hex'
import { SchemaSchema } from '@xyo-network/schema-payload-plugin'

import type { Condition } from '../types/index.ts'

export type BuyerCondition = Condition & {
  definition: {
    contains: {
      properties: {
        buyer: {
          items: {
            const: Address
            type: 'string'
          }
          minItems: 1
          type: 'array'
        }
        schema: { const: 'network.xyo.escrow.terms'; type: 'string' }
      }
      required: ['schema', 'buyer']
      type: 'object'
    }
    type: 'array'
  }
  schema: SchemaSchema
}

/**
 * Creates a coupon condition that requires a specific buyer
 * @param buyer The buyer's address
 * @returns A coupon condition that requires a specific buyer
 */
export const createConditionForRequiredBuyer = (buyer: Address): BuyerCondition => {
  return {
    schema: SchemaSchema,
    definition: {
      type: 'array',
      contains: {
        type: 'object',
        properties: {
          schema: { type: 'string', const: 'network.xyo.escrow.terms' },
          buyer: {
            type: 'array', items: { type: 'string', const: buyer }, minItems: 1,
          },
        },
        required: ['schema', 'buyer'],
      },
    },
  }
}
