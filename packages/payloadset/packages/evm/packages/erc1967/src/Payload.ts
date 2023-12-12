import { Address } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { Erc1967SlotStatus } from './lib'

export const Erc1967StatusSchema = 'network.xyo.erc1967.status'
export type Erc1967StatusSchema = typeof Erc1967StatusSchema

export type Erc1967Status = Payload<
  {
    address: Address
    beacon?: Erc1967SlotStatus['beacon']
    block: number
    chainId: number
    implementation?: Erc1967SlotStatus['implementation']
    slots?: Erc1967SlotStatus['slots']
  },
  Erc1967StatusSchema
>
