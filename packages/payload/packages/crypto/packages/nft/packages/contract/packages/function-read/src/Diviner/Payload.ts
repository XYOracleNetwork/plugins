import { Payload } from '@xyo-network/payload-model'

export const ContractInfoSchema = 'network.xyo.crypto.contract.info'
export type ContractInfoSchema = typeof ContractInfoSchema

export interface BaseContractInfo<T extends Record<string, unknown> = Record<string, unknown>> {
  address: string
  chainId: string
  results?: T
}

export type ContractInfo = Payload<BaseContractInfo, ContractInfoSchema>

export const Erc721ContractInfoSchema = `${ContractInfoSchema}.erc721`
export type Erc721ContractInfoSchema = typeof Erc721ContractInfoSchema

export type Erc771ContractInfo = Payload<
  BaseContractInfo<{
    name: string
    symbol: string
    totalSupply: string
  }>,
  Erc721ContractInfoSchema
>

export const Erc1155ContractInfoSchema = `${ContractInfoSchema}.erc1155`
export type Erc1155ContractInfoSchema = typeof Erc1155ContractInfoSchema
export type Erc1155ContractInfo = Payload<
  BaseContractInfo<{
    url: string
  }>,
  Erc1155ContractInfoSchema
>
