import type { EthereumGasEtherscanPayload } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import type { FeeData, FeePerGas } from '@xyo-network/gas-price-payload-plugin'
import regression from 'regression'

const getBaseFee = (payload: EthereumGasEtherscanPayload): number | undefined => {
  const { suggestBaseFee } = payload.result
  return Number.parseFloat(suggestBaseFee)
}

const getFeePerGas = (payload: EthereumGasEtherscanPayload): Partial<FeePerGas> => {
  const {
    FastGasPrice, ProposeGasPrice, SafeGasPrice,
  } = payload.result
  const low = Number.parseFloat(SafeGasPrice)
  const medium = Number.parseFloat(ProposeGasPrice)
  const high = Number.parseFloat(FastGasPrice)
  const veryHigh = regression.linear([
    [0, low],
    [1, medium],
    [2, high],
  ]).predict(3)[1]
  return {
    high, low, medium, veryHigh,
  }
}

export const transformGasFromEtherscan = (payload: EthereumGasEtherscanPayload): FeeData => {
  const baseFee = getBaseFee(payload)
  const feePerGas = getFeePerGas(payload)
  const priorityFeePerGas = {}
  return {
    baseFee, feePerGas, priorityFeePerGas,
  }
}
