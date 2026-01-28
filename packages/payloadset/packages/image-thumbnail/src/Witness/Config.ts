import { ImageThumbnailSchema } from '@xyo-network/image-thumbnail-payload-plugin'
import { asSchema } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

export const ImageThumbnailWitnessConfigSchema = asSchema(`${ImageThumbnailSchema}.witness.config`, true)
export type ImageThumbnailWitnessConfigSchema = typeof ImageThumbnailWitnessConfigSchema

export type ImageThumbnailEncoding = 'PNG' | 'JPG' | 'GIF'

export type ImageThumbnailWitnessConfig = WitnessConfig<{
  dataUrlPassthrough?: boolean
  encoding?: ImageThumbnailEncoding
  height?: number
  ipfsGateway?: string
  maxAsyncProcesses?: number
  maxCacheBytes?: number
  maxCacheEntries?: number
  quality?: number
  runExclusive?: boolean
  schema: ImageThumbnailWitnessConfigSchema
  width?: number
}>
