import type { EthereumGasEtherchainV2Payload } from '@xyo-network/etherchain-gas-ethereum-blockchain-payload-plugins'
import type { FeeData, FeePerGas } from '@xyo-network/gas-price-payload-plugin'

const getFeePerGas = (payload: EthereumGasEtherchainV2Payload): Partial<FeePerGas> => {
  const {
    slow, standard, fast, rapid,
  } = payload.data
  const low = slow / 1_000_000_000
  const medium = standard / 1_000_000_000
  const high = fast / 1_000_000_000
  const veryHigh = rapid / 1_000_000_000
  return {
    high, low, medium, veryHigh,
  }
}

export const transformGasFromEtherchainV2 = (payload: EthereumGasEtherchainV2Payload): FeeData => {
  const baseFee = undefined
  const feePerGas = getFeePerGas(payload)
  const priorityFeePerGas = {}
  return {
    baseFee, feePerGas, priorityFeePerGas,
  }
}
