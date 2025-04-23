import { fulfilled } from '@xylabs/promise'
import type { UniswapCryptoPair } from '@xyo-network/uniswap-crypto-market-payload-plugin'

import type { EthersUniSwap3Pair } from './index.ts'
import { logErrorsAsync } from './logErrors.ts'

export const pricesFromUniswap3 = async (pools: EthersUniSwap3Pair[]): Promise<UniswapCryptoPair[]> => {
  return await logErrorsAsync(async () => {
    const promiseResults = await Promise.allSettled(
      pools.map(async (pool): Promise<UniswapCryptoPair> => {
        const result = await pool.price()
        return result
      }),
    )
    return promiseResults.filter(fulfilled).map(result => result.value)
  })
}
