import { asSchema } from '@xyo-network/payload-model'

export type EthereumGasEthersSchema = typeof EthereumGasEthersSchema
export const EthereumGasEthersSchema = asSchema('network.xyo.blockchain.ethereum.gas.ethers', true)
