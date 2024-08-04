import { NftInfoFields } from '../NftInfo/index.ts'
import { OpenSeaNftMetadata } from './OpenSeaNftMetadata.ts'

export interface OpenSeaNftInfoFields extends NftInfoFields {
  metadata: OpenSeaNftMetadata
}
