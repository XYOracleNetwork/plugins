import { NftInfoFields } from '../NftInfo'
import { OpenSeaNftMetadata } from './OpenSeaNftMetadata'

export interface OpenSeaNftInfoFields extends NftInfoFields {
  metadata: OpenSeaNftMetadata
}
