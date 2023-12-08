import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

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
 * Checks if the payload is a crypto contract info payload
 *
 * @param payload The payload to check
 * @returns True if the payload is a contract info payload
 */
export const isCryptoContractInfo = isPayloadOfSchemaType<ContractInfo>(ContractInfoSchema)
