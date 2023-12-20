import { Payload } from '@xyo-network/payload-model'

export const EvmEventsSchema = 'network.xyo.evm.events'
export type EvmEventsSchema = typeof EvmEventsSchema

export type EvmEvents = Payload<
  {
    address?: string
    eventName?: string
    fromBlock?: number
    toBlock?: number
  },
  EvmEventsSchema
>

export const EvmEventSchema = 'network.xyo.evm.event'
export type EvmEventSchema = typeof EvmEventSchema

export type EvmEvent = Payload<
  {
    address: string
    args: Record<string, unknown>
    block: number
    chainId: number
    eventName: string
  },
  EvmEventSchema
>
