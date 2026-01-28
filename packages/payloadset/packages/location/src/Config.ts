import type { AnyConfigSchema, ModuleParams } from '@xyo-network/module-model'
import { asSchema } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

export type CurrentLocationWitnessConfigSchema = typeof CurrentLocationWitnessConfigSchema
export const CurrentLocationWitnessConfigSchema = asSchema('network.xyo.location.current.config', true)

export type CurrentLocationWitnessConfig = WitnessConfig<{
  schema: CurrentLocationWitnessConfigSchema
}>

export interface CurrentLocationWitnessParams extends ModuleParams<AnyConfigSchema<CurrentLocationWitnessConfig>> { geolocation?: Geolocation }
