import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

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
export type Erc721ContractInfo = Payload<
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

/**
 * Identity function for ERC-721 crypto contract info payload
 */
export const isErc721ContractInfo = isPayloadOfSchemaType<Erc721ContractInfo>(Erc721ContractInfoSchema)
