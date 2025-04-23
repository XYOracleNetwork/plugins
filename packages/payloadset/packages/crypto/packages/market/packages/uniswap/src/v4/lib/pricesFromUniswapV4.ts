import { Provider } from 'ethers'
import { UniswapCryptoPair } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { PoolIdType } from './UniswapV4TokenContracts.ts'
import { priceFromUniswapV4 } from './priceFromUniswapV4.ts'

export const pricesFromUniswapV4 = async (poolId: PoolIdType[], provider: Provider): Promise<UniswapCryptoPair[]> => {
  return await Promise.all(poolId.map(async (pool) => priceFromUniswapV4(pool, provider)))
}
