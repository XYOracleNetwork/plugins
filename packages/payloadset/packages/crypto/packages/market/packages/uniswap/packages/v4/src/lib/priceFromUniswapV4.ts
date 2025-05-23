import type { UniswapCryptoPair, UniswapCryptoToken } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { Provider } from 'ethers'
import { ZeroAddress } from 'ethers'

import type { TokenPairPoolKey } from '../types/index.ts'
import { getExchangeRate } from './getExchangeRate.ts'
import { tokenRegistryValueToToken } from './tokenRegistryValueToToken.ts'

export const priceFromUniswapV4 = async (poolId: TokenPairPoolKey, provider: Provider): Promise<UniswapCryptoPair> => {
  const {
    tokens, fee, hookAddress = ZeroAddress,
  } = poolId
  const tokenA = tokenRegistryValueToToken(tokens[0])
  const tokenB = tokenRegistryValueToToken(tokens[1])
  const rate = await getExchangeRate(tokenA, tokenB, fee, hookAddress, provider)
  const token0: UniswapCryptoToken = {
    address: tokenA.address,
    symbol: tokenA.symbol || '',
    value: Math.max(rate, 0),
  }
  const token1: UniswapCryptoToken = {
    address: tokenB.address,
    symbol: tokenB.symbol || '',
    value: rate > 0 ? Number((1 / rate).toPrecision(6)) : 0,
  }
  const pair: UniswapCryptoPair = { tokens: [token0, token1] }
  return pair
}
