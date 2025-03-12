/* eslint-disable unicorn/no-thenable */
import { SchemaSchema } from '@xyo-network/schema-payload-plugin'

import type { Condition } from '../types/index.ts'

/**
 * Creates a coupon condition that requires an appraisal amount below a certain value
 * @param maximumAppraisalAmount The maximum appraisal amount
 * @returns A condition that requires an appraisal amount below a certain value
 */
export const createConditionForMaximumAppraisalAmount = (maximumAppraisalAmount: number): Condition => {
  return {
    schema: SchemaSchema,
    definition: {
      allOf: [
        {
          type: 'array',
          contains: {
            type: 'object',
            properties: {
              schema: { type: 'string', const: 'network.xyo.escrow.terms' },
              appraisals: { type: 'array', minItems: 1 },
            },
            required: ['schema', 'appraisals'],
          },
        },
        {
          type: 'array',
          contains: {
            type: 'object',
            properties: { schema: { type: 'string', const: 'network.xyo.hash.lease.estimate' } },
            required: ['schema'],
          },
          items: {
            type: 'object',
            if: { properties: { schema: { type: 'string', const: 'network.xyo.hash.lease.estimate' } } },
            then: { properties: { price: { type: 'number', maximum: maximumAppraisalAmount } }, required: ['price'] },
          },
        },
      ],
    },
  }
}
