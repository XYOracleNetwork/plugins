import { Payload } from '@xyo-network/payload-model'

import { Erc1822SlotStatus } from './lib/index.ts'

export const Erc1822StatusSchema = 'network.xyo.erc1822.status'
export type Erc1822StatusSchema = typeof Erc1822StatusSchema

export type Erc1822Status = Payload<
  {
    address: string
    block: number
    chainId: number
    implementation?: Erc1822SlotStatus['implementation']
    slots?: Erc1822SlotStatus['slots']
  },
  Erc1822StatusSchema
>
