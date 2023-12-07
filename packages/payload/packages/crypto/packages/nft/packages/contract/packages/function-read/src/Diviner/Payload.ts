import { Payload } from '@xyo-network/payload-model'

/**
 * The schema for the contract info
 */
export const ContractInfoSchema = 'network.xyo.crypto.contract.info'
/**
 * The schema for the contract info
 */
export type ContractInfoSchema = typeof ContractInfoSchema

/**
 * The base smart contract info
 */
export interface SmartContractInfo<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The address of the smart contract
   */
  address: string
  /**
   * The chain id of the smart contract
   */
  chainId: string
  /**
   * The ABI of the smart contract
   */
  results?: T
}

/**
 * The smart contract info payload
 */
export type ContractInfo = Payload<SmartContractInfo, ContractInfoSchema>

/**
 * The schema for the ERC721 contract info
 */
export const Erc721ContractInfoSchema = `${ContractInfoSchema}.erc721`
/**
 * The schema for the ERC721 contract info
 */
export type Erc721ContractInfoSchema = typeof Erc721ContractInfoSchema

/**
 * The ERC721 smart contract info payload
 */
export type Erc771ContractInfo = Payload<
  SmartContractInfo<{
    /**
     * The name of the ERC721 token
     */
    name: string
    /**
     * The symbol of the ERC721 token
     */
    symbol: string
    /**
     * The total supply of the ERC721 token
     */
    totalSupply: string
  }>,
  Erc721ContractInfoSchema
>

/**
 * The schema for the ERC1155 contract info
 */
export const Erc1155ContractInfoSchema = `${ContractInfoSchema}.erc1155`
/**
 * The schema for the ERC1155 contract info
 */
export type Erc1155ContractInfoSchema = typeof Erc1155ContractInfoSchema

/**
 * The ERC1155 smart contract info payload
 */
export type Erc1155ContractInfo = Payload<
  SmartContractInfo<{
    /**
     * The url of the ERC1155 token
     */
    url: string
  }>,
  Erc1155ContractInfoSchema
>
