import { SchemaSchema } from '@xyo-network/schema-payload-plugin'

const CONDITION_REQUIRES_BUYING_TWO = {
  schema: SchemaSchema,
  definition: {
    type: 'array',
    contains: {
      type: 'object',
      properties: {
        schema: { type: 'string', const: 'network.xyo.escrow.terms' },
        assets: { type: 'array', minItems: 2 },
      },
      required: ['schema', 'assets'],
    },
  },
}
