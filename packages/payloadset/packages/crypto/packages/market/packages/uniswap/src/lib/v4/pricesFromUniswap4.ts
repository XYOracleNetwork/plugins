import { Provider, ZeroAddress } from 'ethers'
import { getExchangeRate } from './getExchangeRate.ts'
import { UniswapV4TokenContractIdentifier } from './UniswapV4TokenContractIdentifier.ts'

export const pricesFromUniswap4 = async (contract: UniswapV4TokenContractIdentifier, provider: Provider) => {
  const { tokenA, tokenB, fee, hookAddress = ZeroAddress } = contract
  const rate = await getExchangeRate(tokenA, tokenB, fee, hookAddress, provider)
  return rate
}
