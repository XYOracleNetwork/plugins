import { Provider, ZeroAddress } from 'ethers'
import { getExchangeRate } from './getExchangeRate.ts'
import { UniswapCryptoPair, UniswapCryptoToken } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { tokenRegistryValueToToken } from './tokenRegistryValueToToken.ts'
import { PoolIdType } from '../types/index.ts'

export const priceFromUniswapV4 = async (poolId: PoolIdType, provider: Provider): Promise<UniswapCryptoPair> => {
  const { tokens, fee, hookAddress = ZeroAddress } = poolId
  const tokenA = tokenRegistryValueToToken(tokens[0])
  const tokenB = tokenRegistryValueToToken(tokens[1])
  const rate = await getExchangeRate(tokenA, tokenB, fee, hookAddress, provider)
  const token0: UniswapCryptoToken = {
    address: tokenA.address,
    symbol: tokenA.symbol || '',
    value: rate > 0 ? rate : 0,
  }
  const token1: UniswapCryptoToken = {
    address: tokenB.address,
    symbol: tokenB.symbol || '',
    value: rate > 0 ? Number((1 / rate).toPrecision(6)) : 0,
  }
  const pair: UniswapCryptoPair = {
    tokens: [ token0, token1 ]
  }
  return pair
}
