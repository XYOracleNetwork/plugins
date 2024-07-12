import { NftContractInformation } from './NftContractInformation.js'
import { NftMetadata } from './NftMetadata.js'

export interface NftInfoFields extends NftContractInformation {
  metadata?: NftMetadata
  metadataUri?: string
  supply: string
  tokenId: string
}
