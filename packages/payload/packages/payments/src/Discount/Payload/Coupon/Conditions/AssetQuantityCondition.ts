import { SchemaSchema } from '@xyo-network/schema-payload-plugin'

import { Condition } from '../types/index.ts'

/**
 * Returns a coupon condition that requires a minimum quantity of assets
 * @param minimumAssetQuantity The minimum quantity of assets required
 * @returns A condition that requires a minimum quantity of assets
 */
export const createConditionForMinimumAssetQuantity = (minimumAssetQuantity: number): Condition => {
  return {
    schema: SchemaSchema,
    definition: {
      type: 'array',
      contains: {
        type: 'object',
        properties: {
          schema: { type: 'string', const: 'network.xyo.escrow.terms' },
          assets: { type: 'array', minItems: minimumAssetQuantity },
        },
        required: ['schema', 'assets'],
      },
    },
  }
}
