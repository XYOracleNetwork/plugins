import { AssetInfo, CryptoMarketAssetPayload, CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { PayloadBuilder } from '@xyo-network/payload-builder'

import { average } from '../average'

const schema = CryptoMarketAssetSchema

const getPayloadWithPrice = (price: number): CryptoMarketAssetPayload => {
  const assets: Record<string, AssetInfo> = { xyo: { value: { usd: price.toString() } } }
  const timestamp = Date.now()
  return new PayloadBuilder<CryptoMarketAssetPayload>({ schema }).fields({ assets, timestamp }).build()
}

describe('average', () => {
  it('averages numbers', () => {
    const payloads = [getPayloadWithPrice(1), getPayloadWithPrice(2), getPayloadWithPrice(3)]
    expect(average(...payloads)?.xyo?.value?.usd).toBe('2')
  })
  it('handles single value', () => {
    const payloads = [getPayloadWithPrice(1)]
    expect(average(...payloads)?.xyo?.value?.usd).toBe('1')
  })
  it('handles no values', () => {
    expect(average()?.xyo?.value?.usd).toBeUndefined()
  })
  it('handles undefined values', () => {
    const payloads = [getPayloadWithPrice(1), undefined, getPayloadWithPrice(3)]
    expect(average(...payloads)?.xyo?.value?.usd).toBe('2')
  })
})
