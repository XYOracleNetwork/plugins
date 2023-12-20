import { NftInfoFields } from '../Info'
import { OpenSeaNftMetadata } from './OpenSeaNftMetadata'

export interface OpenSeaNftInfoFields extends NftInfoFields {
  metadata: OpenSeaNftMetadata
}
