import { axiosJson } from '@xylabs/sdk-js'
import type { EthereumGasEtherscanResponse } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'

export const getGasFromEtherscan = async (apiKey: string): Promise<EthereumGasEtherscanResponse> => {
  const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`
  return (await axiosJson.get<EthereumGasEtherscanResponse>(url)).data
}
