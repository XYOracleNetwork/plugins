import { asSchema } from '@xyo-network/payload-model'

export type EthereumGasSchema = typeof EthereumGasSchema
export const EthereumGasSchema = asSchema('network.xyo.blockchain.ethereum.gas', true)
