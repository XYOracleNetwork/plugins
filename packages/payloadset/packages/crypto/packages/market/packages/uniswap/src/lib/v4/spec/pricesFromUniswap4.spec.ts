import '@xylabs/vitest-extended'

import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect, test,
} from 'vitest'
import { pricesFromUniswap4 } from '../pricesFromUniswap4.ts'


describe.skipIf(!(process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET))('pricesFromUniswap4', () => {
  test('pricesFromUniswap4', async () => {
    const provider = getProviderFromEnv()
    const value = await pricesFromUniswap4(provider)
    expect(value).toBeDefined()
  })
})
