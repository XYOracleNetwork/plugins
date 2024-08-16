import type { TokenType } from './TokenType.ts'

export interface NftContractInformation {
  address: string
  chainId: number
  implementation?: string
  /** @deprecated use types instead */
  type?: TokenType
  types?: TokenType[]
}
