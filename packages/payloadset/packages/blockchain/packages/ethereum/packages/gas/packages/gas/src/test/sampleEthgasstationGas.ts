import type { EthereumGasEthgasstationPayload } from '@xyo-network/ethgasstation-ethereum-gas-payload-plugin'
import { EthereumGasEthgasstationSchema } from '@xyo-network/ethgasstation-ethereum-gas-payload-plugin'

export const sampleEthgasstationGas: EthereumGasEthgasstationPayload = {
  baseFee: 10,
  blockNumber: 16_028_883,
  blockTime: 11.88,
  gasPrice: {
    fast: 12,
    instant: 13,
    standard: 12,
  },
  nextBaseFee: 10,
  priorityFee: {
    fast: 2,
    instant: 2,
    standard: 2,
  },
  schema: EthereumGasEthgasstationSchema,
  timestamp: 1_668_697_958_837,
}
