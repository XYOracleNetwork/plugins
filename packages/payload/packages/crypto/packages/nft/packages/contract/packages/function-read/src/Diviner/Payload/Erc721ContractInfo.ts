import type { Payload } from '@xyo-network/payload-model'
import { asSchema, isPayloadOfSchemaType } from '@xyo-network/payload-model'

import type { ContractInfoFields } from './ContractInfo.ts'
import { ContractInfoSchema } from './ContractInfo.ts'

/**
 * The schema for the ERC721 contract info
 */
export const Erc721ContractInfoSchema = asSchema(`${ContractInfoSchema}.erc721`, true)
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
