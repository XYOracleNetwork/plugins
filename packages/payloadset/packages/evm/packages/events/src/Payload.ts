import { asSchema, type Payload } from '@xyo-network/payload-model'

export const EvmEventsSchema = asSchema('network.xyo.evm.events', true)
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

export const EvmEventSchema = asSchema('network.xyo.evm.event', true)
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
