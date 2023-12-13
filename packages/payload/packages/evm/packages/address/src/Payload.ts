import { Payload } from '@xyo-network/payload-model'

import { EvmAddressSchema } from './Schema'

export type EvmAddress = Payload<
  {
    address: string
    chainId: number
  },
  EvmAddressSchema
>
