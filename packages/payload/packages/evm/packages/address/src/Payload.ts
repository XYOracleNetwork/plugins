import type { Payload } from '@xyo-network/payload-model'

import type { EvmAddressSchema } from './Schema.ts'

/**
 * The fields of an EVM address payload
 */
export interface EvmAddressFields {
  /**
   * An EVM address
   */
  address: string
  /**
   * The EVM chain ID
   */
  chainId: number
}

/**
 * A payload that contains an EVM address
 */
export type EvmAddress = Payload<EvmAddressFields, EvmAddressSchema>
