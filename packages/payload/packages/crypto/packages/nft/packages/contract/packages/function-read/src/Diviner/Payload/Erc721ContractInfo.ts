import { Payload } from '@xyo-network/payload-model'

import { ContractInfoFields, ContractInfoSchema } from './ContractInfo'

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
  ContractInfoFields<{
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
