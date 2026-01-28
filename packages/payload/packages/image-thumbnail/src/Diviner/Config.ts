import type { DivinerConfig } from '@xyo-network/diviner-model'
import { asSchema } from '@xyo-network/payload-model'

import { ImageThumbnailDivinerSchema } from './Schema.ts'

export const ImageThumbnailDivinerConfigSchema = asSchema(`${ImageThumbnailDivinerSchema}.config`, true)
export type ImageThumbnailDivinerConfigSchema = typeof ImageThumbnailDivinerConfigSchema

/**
 * Describes an Archivist/Diviner combination
 * that enables searching signed payloads
 */
export interface SearchableStorage {
  archivist: string
  boundWitnessDiviner: string
  payloadDiviner: string
}

export type ImageThumbnailDivinerConfig = DivinerConfig<{
  /**
   * Where the diviner should store it's index
   */
  indexStore?: SearchableStorage
  payloadDivinerLimit?: number
  pollFrequency?: number
  schema: ImageThumbnailDivinerConfigSchema
  /**
   * Where the diviner should persist its internal state
   */
  stateStore?: SearchableStorage
}>
