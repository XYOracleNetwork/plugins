import { Provider } from 'ethers'
import { Token } from '@uniswap/sdk-core'
import { getExchangeRate } from './getExchangeRate.ts'


export const pricesFromUniswap4 = async (tokenA: Token, tokenB: Token, provider: Provider) => {
  const rate = await getExchangeRate(provider, tokenA, tokenB, 3000)
  return rate
}
