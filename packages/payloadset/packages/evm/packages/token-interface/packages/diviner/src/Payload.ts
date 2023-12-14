import { Payload } from '@xyo-network/payload-model'
import { JsonFragment } from 'ethers'

export type ERC20TokenInterfaces = 'ERC20'
export type ERC721TokenInterfaces = 'ERC721' | 'ERC721TokenReceiver' | 'ERC721Metadata' | 'ERC721Enumerable'
export type ERC1155TokenInterfaces = 'ERC1155' | 'ERC1155TokenReceiver' | 'ERC1155Metadata_URI'

export type TokenInterface = ERC20TokenInterfaces | ERC721TokenInterfaces | ERC1155TokenInterfaces

export const EvmTokenInterfaceImplementedSchema = 'network.xyo.evm.token.interface.implemented'
export type EvmTokenInterfaceImplementedSchema = typeof EvmTokenInterfaceImplementedSchema

export type EvmTokenInterfaceImplemented = Payload<
  {
    address: string
    chainId: number
    implemented: boolean
    tokenInterface: TokenInterface
  },
  EvmTokenInterfaceImplementedSchema
>
