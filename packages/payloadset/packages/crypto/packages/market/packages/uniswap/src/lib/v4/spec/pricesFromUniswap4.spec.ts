import '@xylabs/vitest-extended'

import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect, test,
} from 'vitest'
import { pricesFromUniswap4 } from '../pricesFromUniswap4.ts'
import { Token } from '@uniswap/sdk-core'

describe.skipIf(!(process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET))('pricesFromUniswap4', () => {
  test('pricesFromUniswap4', async () => {
    const provider = getProviderFromEnv()
    const tokenA = new Token(1, "0x55296f69f40ea6d20e478533c15a6b08b654e758", 18, 'XYO')
    const tokenB = new Token(1, "0xdac17f958d2ee523a2206206994597c13d831ec7", 6, 'USDT')
    const value = await pricesFromUniswap4(tokenA, tokenB, provider)
    expect(value).toBeDefined()
  })
})
