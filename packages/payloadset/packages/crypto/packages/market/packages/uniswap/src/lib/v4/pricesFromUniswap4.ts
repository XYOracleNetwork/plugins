import { Provider, ZeroAddress } from 'ethers'
import { getExchangeRate } from './getExchangeRate.ts'
import { UniswapV4TokenContractIdentifier } from './UniswapV4TokenContractIdentifier.ts'
import { UniswapCryptoPair, UniswapCryptoToken } from '@xyo-network/uniswap-crypto-market-payload-plugin'

export const pricesFromUniswap4 = async (contract: UniswapV4TokenContractIdentifier, provider: Provider): Promise<UniswapCryptoPair> => {
  const { tokenA, tokenB, fee, hookAddress = ZeroAddress } = contract
  const rate = await getExchangeRate(tokenA, tokenB, fee, hookAddress, provider)
  
  const token0: UniswapCryptoToken = {
    address: tokenA.address,
    symbol: tokenA.symbol || '',
    value: rate,
  }
  const token1: UniswapCryptoToken = {
    address: tokenB.address,
    symbol: tokenB.symbol || '',
    value: Number((1 / rate).toPrecision(6)),
  }
  const pair: UniswapCryptoPair = {
    tokens: [ token0, token1 ]
  }
  return pair
}
