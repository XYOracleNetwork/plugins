import { CryptoMarketAssetPayload, CryptoMarketAssetSchema } from '@xyo-network/crypto-asset-payload-plugin'
import { Payload, WithMeta } from '@xyo-network/payload-model'

import { CryptoMarketAssetDiviner } from '../Diviner.js'
import { sampleCoinGeckoPayload, sampleUniswapPayload } from '../test/index.js'

const coinGeckoPayload = sampleCoinGeckoPayload
const uniswapPayload = sampleUniswapPayload

describe('Diviner', () => {
  const cases: [input: string, expected: string, data: Payload[]][] = [
    ['only CoinGecko Payload', 'observation', [coinGeckoPayload]],
    ['only Uniswap Payload', 'observation', [uniswapPayload]],
    ['CoinGecko & Uniswap Payload', 'observation', [coinGeckoPayload, uniswapPayload]],
    ['no inputs', 'empty observation', []],
  ]
  test.each(cases)('with %s returns %s', async (_input: string, _expected: string, data: Payload[]) => {
    const diviner = await CryptoMarketAssetDiviner.create({ account: 'random' })
    const payloads = await diviner.divine(data)
    expect(payloads).toBeArray()
    expect(payloads.length).toBe(1)
    payloads.map((payload) => {
      if (payload?.schema === CryptoMarketAssetSchema) {
        const assetPayload = payload as WithMeta<CryptoMarketAssetPayload>
        expect(assetPayload).toBeObject()
        expect(assetPayload?.assets).toBeObject()
        expect(assetPayload?.schema).toBe(CryptoMarketAssetSchema)
        expect(assetPayload?.timestamp).toBeNumber()
      }
    })
  })
})
