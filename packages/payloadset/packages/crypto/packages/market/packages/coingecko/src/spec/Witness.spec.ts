import '@xylabs/vitest-extended'

import type { CoingeckoCryptoMarketPayload } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { CoingeckoCryptoMarketSchema } from '@xyo-network/coingecko-crypto-market-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import {
  describe, expect,
  test,
} from 'vitest'

import { defaultCoins, defaultCurrencies } from '../lib/index.ts'
import { CoingeckoCryptoMarketWitnessConfigSchema } from '../Schema.ts'
import { CoingeckoCryptoMarketWitness } from '../Witness.ts'

describe('CoingeckoCryptoMarketWitness', () => {
  test('returns observation', async () => {
    const sut = await CoingeckoCryptoMarketWitness.create({
      account: 'random',
      config: {
        coins: defaultCoins,
        currencies: defaultCurrencies,
        schema: CoingeckoCryptoMarketWitnessConfigSchema,
      },
    })
    const [actual] = await sut.observe()
    expect(actual.schema).toBe(CoingeckoCryptoMarketSchema)
    const answerWrapper = PayloadWrapper.wrap(actual) as PayloadWrapper<CoingeckoCryptoMarketPayload>
    expect(await answerWrapper.getValid()).toBe(true)
    expect(answerWrapper.payload.assets).toBeObject()
    const assets = Object.keys(answerWrapper.payload.assets)
    expect(assets).toBeArray()
    expect(assets.length).toBeGreaterThan(0)
  })

  test('returns observation [no config]', async () => {
    const sut = await CoingeckoCryptoMarketWitness.create({ account: 'random' })
    const [actual] = await sut.observe()
    expect(actual.schema).toBe(CoingeckoCryptoMarketSchema)
    const answerWrapper = PayloadWrapper.wrap(actual) as PayloadWrapper<CoingeckoCryptoMarketPayload>
    expect(await answerWrapper.getValid()).toBe(true)
    expect(answerWrapper.payload.assets).toBeObject()
    const assets = Object.keys(answerWrapper.payload.assets)
    expect(assets).toBeArray()
    expect(assets.length).toBe(0)
  })
})
