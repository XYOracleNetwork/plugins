import type { EthereumGasEthersPayload } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import type { FeeData, FeePerGas, PriorityFeePerGas } from '@xyo-network/gas-price-payload-plugin'

const getBaseFee = (payload: EthereumGasEthersPayload): number | undefined => {
  const { gasPrice } = payload
  return gasPrice ? gasPrice / 1_000_000_000 : undefined
}

const getFeePerGas = (payload: EthereumGasEthersPayload): Partial<FeePerGas> => {
  const { maxFeePerGas } = payload
  const high = maxFeePerGas ? maxFeePerGas / 1_000_000_000 : undefined
  return { high }
}

const getPriorityFeePerGas = (payload: EthereumGasEthersPayload): Partial<PriorityFeePerGas> => {
  const { maxPriorityFeePerGas } = payload
  const high = maxPriorityFeePerGas ? maxPriorityFeePerGas / 1_000_000_000 : undefined
  return { high }
}

export const transformGasFromEthers = (payload: EthereumGasEthersPayload): FeeData => {
  const baseFee = getBaseFee(payload)
  const feePerGas = getFeePerGas(payload)
  const priorityFeePerGas = getPriorityFeePerGas(payload)
  return { baseFee, feePerGas, priorityFeePerGas }
}
