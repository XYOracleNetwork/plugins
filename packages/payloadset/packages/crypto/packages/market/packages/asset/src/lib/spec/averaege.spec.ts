import '@xylabs/vitest-extended'

import type { AssetInfo, CryptoMarketAssetPayload } from '@xyo-network/crypto-asset-payload-plugin'
import { CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import {
  describe, expect,
  it,
} from 'vitest'

import { average } from '../average.ts'

const schema = CryptoMarketAssetSchema

const getPayloadWithPrice = async (price: number): Promise<CryptoMarketAssetPayload> => {
  const assets: Record<string, AssetInfo> = { xyo: { value: { usd: price.toString() } } }
  const timestamp = Date.now()
  return await new PayloadBuilder<CryptoMarketAssetPayload>({ schema }).fields({ assets, timestamp }).build()
}

describe('average', () => {
  it('averages numbers', async () => {
    const payloads = await Promise.all([getPayloadWithPrice(1), getPayloadWithPrice(2), getPayloadWithPrice(3)])
    expect(average(...payloads)?.xyo?.value?.usd).toBe('2')
  })
  it('handles single value', async () => {
    const payloads = await getPayloadWithPrice(1)
    expect(average(payloads)?.xyo?.value?.usd).toBe('1')
  })
  it('handles no values', () => {
    expect(average()?.xyo?.value?.usd).toBeUndefined()
  })
  it('handles undefined values', async () => {
    const payloads = await Promise.all([getPayloadWithPrice(1), undefined, getPayloadWithPrice(3)])
    expect(average(...payloads)?.xyo?.value?.usd).toBe('2')
  })
})
