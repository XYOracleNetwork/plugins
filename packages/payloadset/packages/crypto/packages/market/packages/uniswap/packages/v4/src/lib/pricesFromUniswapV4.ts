import type { UniswapCryptoPair } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import type { Provider } from 'ethers'

import type { TokenPairPoolKey } from '../types/index.ts'
import { priceFromUniswapV4 } from './priceFromUniswapV4.ts'

export const pricesFromUniswapV4 = async (poolId: TokenPairPoolKey[], provider: Provider): Promise<UniswapCryptoPair[]> => {
  return await Promise.all(poolId.map(async pool => priceFromUniswapV4(pool, provider)))
}
