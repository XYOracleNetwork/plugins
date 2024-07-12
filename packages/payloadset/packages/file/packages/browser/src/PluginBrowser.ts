import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

import { BrowserFileWitness } from './BrowserFileWitness.js'
import { FileSchema } from './Schema.js'

export const BrowserFilePlugin = () =>
  createPayloadSetWitnessPlugin<BrowserFileWitness>(
    { required: { [FileSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await BrowserFileWitness.create(params)
        return result
      },
    },
  )
