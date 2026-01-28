import type { DivinerConfig } from '@xyo-network/diviner-model'
import type { LocationCertaintySchema } from '@xyo-network/location-certainty-payload-plugin'
import { asSchema, type Payload } from '@xyo-network/payload-model'

export type LocationCertaintyDivinerConfigSchema = typeof LocationCertaintyDivinerConfigSchema
export const LocationCertaintyDivinerConfigSchema = asSchema('network.xyo.location.elevation.diviner.config', true)

export type LocationCertaintyDivinerConfig<TConfig extends Payload = Payload> = DivinerConfig<
  TConfig & {
    schema: LocationCertaintyDivinerConfigSchema
    targetSchema?: LocationCertaintySchema
  }
>
