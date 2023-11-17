import { AbstractModuleInstanceSchema } from '@xyo-network/module-instance-payload-plugin'
import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

import { AbstractModuleInstanceWitness } from './Witness'

export const AbstractModuleInstancePlugin = () =>
  createPayloadSetWitnessPlugin<AbstractModuleInstanceWitness>(
    { required: { [AbstractModuleInstanceSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await AbstractModuleInstanceWitness.create(params)
        return result
      },
    },
  )
