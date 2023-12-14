import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

/**
 * ERC20 Token Interfaces
 */
export type ERC20TokenInterfaces = 'ERC20'

/**
 * ERC721 Token Interfaces
 */
export type ERC721TokenInterfaces = 'ERC721' | 'ERC721TokenReceiver' | 'ERC721Metadata' | 'ERC721Enumerable'

/**
 * ERC1155 Token Interfaces
 */
export type ERC1155TokenInterfaces = 'ERC1155' | 'ERC1155TokenReceiver' | 'ERC1155Metadata_URI'

/**
 * All Token Interfaces
 */
export type TokenInterface = ERC20TokenInterfaces | ERC721TokenInterfaces | ERC1155TokenInterfaces

/**
 * The schema for the EVM Token Interface Implemented payload
 */
export const EvmTokenInterfaceImplementedSchema = 'network.xyo.evm.token.interface.implemented'
/**
 * The schema for the EVM Token Interface Implemented payload
 */
export type EvmTokenInterfaceImplementedSchema = typeof EvmTokenInterfaceImplementedSchema

/**
 * The EVM Token Interface Implemented payload
 */
export type EvmTokenInterfaceImplemented = Payload<
  {
    /**
     * The contract address
     */
    address: string
    /**
     * The chain id
     */
    chainId: number
    /**
     * True if the contract implements the interface
     */
    implemented: boolean
    /**
     * The specific token interface
     */
    tokenInterface: TokenInterface
  },
  EvmTokenInterfaceImplementedSchema
>

/**
 * Identity function for EvmTokenInterfaceImplemented payload
 */
export const isEvmTokenInterfaceImplemented = isPayloadOfSchemaType<EvmTokenInterfaceImplemented>(EvmTokenInterfaceImplementedSchema)
