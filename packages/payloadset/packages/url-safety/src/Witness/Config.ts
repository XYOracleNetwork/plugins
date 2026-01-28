import { asSchema } from '@xyo-network/payload-model'
import { UrlSafetySchema } from '@xyo-network/url-safety-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'

export const UrlSafetyWitnessConfigSchema = asSchema(`${UrlSafetySchema}.witness.config`, true)
export type UrlSafetyWitnessConfigSchema = typeof UrlSafetyWitnessConfigSchema

export type UrlSafetyWitnessConfig = WitnessConfig<{
  google?: {
    safeBrowsing?: {
      endPoint?: string
    }
  }
  schema: UrlSafetyWitnessConfigSchema
  urls?: string[]
}>
