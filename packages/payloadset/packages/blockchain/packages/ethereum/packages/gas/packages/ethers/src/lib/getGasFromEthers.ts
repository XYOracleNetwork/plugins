import { EthereumGasEthersResponse } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import { Provider } from 'ethers'

const formatFeeDataValue = (value: bigint | null) => {
  return value ? Number(value) : null
}

export const getGasFromEthers = async (provider: Provider): Promise<EthereumGasEthersResponse> => {
  // https://docs.ethers.io/v5/api/providers/provider/#Provider-getFeeData
  const feeData = await provider.getFeeData()
  const formattedFeeData: EthereumGasEthersResponse = {
    gasPrice: formatFeeDataValue(feeData.gasPrice),
    maxFeePerGas: formatFeeDataValue(feeData.maxFeePerGas),
    maxPriorityFeePerGas: formatFeeDataValue(feeData.maxPriorityFeePerGas),
  }
  return formattedFeeData
}
