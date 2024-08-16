import type { NftContractInformation } from './NftContractInformation.ts'
import type { NftMetadata } from './NftMetadata.ts'

export interface NftInfoFields extends NftContractInformation {
  metadata?: NftMetadata
  metadataUri?: string
  supply: string
  tokenId: string
}
