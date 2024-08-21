import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

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
export interface ContractInfoFields<T extends Record<string, unknown> = Record<string, unknown>> {
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
export type ContractInfo = Payload<ContractInfoFields, ContractInfoSchema>

/**
 * Identity function for crypto contract info payload
 */
export const isContractInfo = isPayloadOfSchemaType<ContractInfo>(ContractInfoSchema)
