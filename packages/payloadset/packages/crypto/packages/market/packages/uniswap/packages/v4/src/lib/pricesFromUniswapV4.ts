import { Provider } from 'ethers'
import { UniswapCryptoPair } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { priceFromUniswapV4 } from './priceFromUniswapV4.ts'
import { HydratedPoolKey } from '../types/index.ts'

export const pricesFromUniswapV4 = async (poolId: HydratedPoolKey[], provider: Provider): Promise<UniswapCryptoPair[]> => {
  return await Promise.all(poolId.map(async (pool) => priceFromUniswapV4(pool, provider)))
}
