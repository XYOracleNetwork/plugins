import { asSchema } from '@xyo-network/payload-model'

/**
 * The schema for an EVM address.
 */
export type EvmAddressSchema = typeof EvmAddressSchema
/**
 * The schema for an EVM address.
 */
export const EvmAddressSchema = asSchema('network.xyo.evm.address', true)
