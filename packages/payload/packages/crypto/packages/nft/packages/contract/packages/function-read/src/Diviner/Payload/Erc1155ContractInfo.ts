import { Payload } from '@xyo-network/payload-model'

import { ContractInfoFields, ContractInfoSchema } from './ContractInfo'

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
  ContractInfoFields<{
    /**
     * The url of the ERC1155 token
     */
    url: string
  }>,
  Erc1155ContractInfoSchema
>
