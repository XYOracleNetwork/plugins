import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

import { PrometheusMetricValueSchema } from './Schema.ts'
import { PrometheusNodeWitness } from './Witness.ts'

export const PrometheusNodePlugin = () =>
  createPayloadSetWitnessPlugin<PrometheusNodeWitness>(
    { required: { [PrometheusMetricValueSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await PrometheusNodeWitness.create(params)
        return result
      },
    },
  )
