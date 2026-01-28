import { asSchema } from '@xyo-network/payload-model'

export type EthereumGasDivinerQuerySchema = typeof EthereumGasDivinerQuerySchema
export const EthereumGasDivinerQuerySchema = asSchema('network.xyo.blockchain.ethereum.gas.diviner.query', true)

export type EthereumGasDivinerConfigSchema = typeof EthereumGasDivinerConfigSchema
export const EthereumGasDivinerConfigSchema = asSchema('network.xyo.blockchain.ethereum.gas.diviner.config', true)
