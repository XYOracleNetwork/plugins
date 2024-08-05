import { describeIf } from '@xylabs/jest-helpers'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'

import { createUniswapPoolContracts } from '../Ethers/index.ts'
import { pricesFromUniswap3 } from '../pricesFromUniswap3.ts'
import { UniswapPoolContracts } from '../UniswapPoolContracts.ts'

describeIf(process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET)('pricesFromUniswap3', () => {
  test('observe', async () => {
    const provider = getProviderFromEnv()
    const pairs = await pricesFromUniswap3(createUniswapPoolContracts(provider, UniswapPoolContracts))
    expect(pairs.length).toBeGreaterThan(1)
  })
})
