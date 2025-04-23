import { Provider } from 'ethers'
import { UniswapCryptoPair } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { priceFromUniswapV4 } from './priceFromUniswapV4.ts'
import { TokenPairPoolKey } from '../types/index.ts'

export const pricesFromUniswapV4 = async (poolId: TokenPairPoolKey[], provider: Provider): Promise<UniswapCryptoPair[]> => {
  return await Promise.all(poolId.map(async (pool) => priceFromUniswapV4(pool, provider)))
}
