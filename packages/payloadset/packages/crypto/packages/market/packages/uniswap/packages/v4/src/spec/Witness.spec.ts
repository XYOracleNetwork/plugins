import '@xylabs/vitest-extended'

import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import type { UniswapCryptoMarketPayload } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { UniswapV4CryptoMarketWitnessConfigSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect,
  test,
} from 'vitest'

import { UniswapV4DefaultPools } from '../lib/index.ts'
import { UniswapV4CryptoMarketWitness } from '../Witness.ts'

describe('UniswapV4CryptoMarketWitness', () => {
  test('observe', async () => {
    const provider = getProviderFromEnv()
    const witness = await UniswapV4CryptoMarketWitness.create({
      account: 'random',
      config: {
        poolKeys: Object.values(UniswapV4DefaultPools),
        schema: UniswapV4CryptoMarketWitnessConfigSchema,
      },
      provider,
    })
    const [observation] = (await witness.observe()) as UniswapCryptoMarketPayload[]
    expect(observation.pairs.length).toBeGreaterThan(0)

    const answerWrapper = PayloadWrapper.wrap(observation)
    expect(await answerWrapper.getValid()).toBe(true)
  })
  test('observe [no config]', async () => {
    const provider = getProviderFromEnv()
    const witness = await UniswapV4CryptoMarketWitness.create({
      account: 'random',
      config: {
        schema: UniswapV4CryptoMarketWitnessConfigSchema,
      },
      provider,
    })
    const [observation] = (await witness.observe()) as UniswapCryptoMarketPayload[]
    expect(observation.pairs.length).toBeGreaterThan(0)

    const answerWrapper = PayloadWrapper.wrap(observation)
    expect(await answerWrapper.getValid()).toBe(true)
  })
})
