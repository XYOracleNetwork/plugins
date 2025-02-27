import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { ContractInfoFields, ContractInfoSchema } from './ContractInfo.ts'

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
     * The uri of the ERC1155 token
     */
    uri: string
  }>,
  Erc1155ContractInfoSchema
>

/**
 * Identity function for ERC-1155 crypto contract info payload
 */
export const isErc1155ContractInfo = isPayloadOfSchemaType<Erc1155ContractInfo>(Erc1155ContractInfoSchema)
