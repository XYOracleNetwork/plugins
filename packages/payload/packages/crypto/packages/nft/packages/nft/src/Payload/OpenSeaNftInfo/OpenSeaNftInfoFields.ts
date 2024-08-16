import type { NftInfoFields } from '../NftInfo/index.ts'
import type { OpenSeaNftMetadata } from './OpenSeaNftMetadata.ts'

export interface OpenSeaNftInfoFields extends NftInfoFields {
  metadata: OpenSeaNftMetadata
}
