import { NftInfoFields } from '../NftInfo/index.js'
import { OpenSeaNftMetadata } from './OpenSeaNftMetadata.js'

export interface OpenSeaNftInfoFields extends NftInfoFields {
  metadata: OpenSeaNftMetadata
}
