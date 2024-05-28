import { assertEx } from '@xylabs/assert'
import { describeIf } from '@xylabs/jest-helpers'
import { JsonObject } from '@xylabs/object'
import { HDWallet } from '@xyo-network/account'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance, SentinelInstance } from '@xyo-network/sentinel-model'
import { asWitnessInstance } from '@xyo-network/witness-model'

import { ApiCallJsonResult, ApiCallResultSchema, ApiCallSchema, ApiUriTemplateCall, isApiCallErrorResult } from '../Payload'
import { ApiCallWitness } from '../Witness'
import tzeroMarketdataManifest from './tzero-marketdata-price-history.json'

describe('tZero', () => {
  const symbol = 'XYLB'
  const apiKey = process.env.TZERO_MARKETDATA_API_KEY

  describeIf(apiKey)('price-history', () => {
    interface TZeroHistoricalPrice extends JsonObject {
      close: number | null
      date: string
      high: number | null
      low: number | null
      open: number | null
      symbol: string
      volume: number
    }
    interface TZeroPriceHistoryResponse extends JsonObject {
      currentPage: number
      priceHistories: TZeroHistoricalPrice[]
      size: number
      totalCount: number
      totalPages: number
    }
    let sentinel: SentinelInstance

    beforeAll(async () => {
      const wallet = await HDWallet.random()
      const locator = new ModuleFactoryLocator()
      locator.register(new ModuleFactory(ApiCallWitness, { headers: { 'x-apikey': apiKey } }))
      const manifest = new ManifestWrapper(tzeroMarketdataManifest as PackageManifestPayload, wallet, locator)
      const node = await manifest.loadNodeFromIndex(0)
      const mods = await node.resolve('*')
      expect(mods.length).toBeGreaterThan(1)
      const resolvedWitness = await node.resolve('ApiCallWitness')
      expect(resolvedWitness).toBeDefined()
      const witness = asWitnessInstance(resolvedWitness)
      expect(witness).toBeDefined()
      const sentinelInstance = asSentinelInstance(await node.resolve('ApiCallSentinel'))
      expect(sentinelInstance).toBeDefined()
      sentinel = assertEx(sentinelInstance)
    })
    it('specifying symbol', async () => {
      const call: ApiUriTemplateCall = { params: { symbol }, schema: ApiCallSchema }

      const report = await sentinel?.report([call])

      const apiCallResult = report?.find(isPayloadOfSchemaType<ApiCallJsonResult<TZeroPriceHistoryResponse>>(ApiCallResultSchema))
      expect(apiCallResult).toBeDefined()
      expect(isApiCallErrorResult(apiCallResult)).toBe(false)
      expect(apiCallResult?.data).toBeObject()
      const data = assertEx(apiCallResult?.data)
      expect(data.currentPage).toEqual(expect.any(Number))
      expect(data.priceHistories).toBeArray()
      expect(data.priceHistories.length).toBeGreaterThan(0)
      for (const priceHistory of data.priceHistories) {
        expect(priceHistory.symbol).toEqual(expect.any(String))
        expect(priceHistory.date).toEqual(expect.any(String))
        expect(priceHistory.open).toBeOneOf([null, expect.any(Number)])
        expect(priceHistory.high).toBeOneOf([null, expect.any(Number)])
        expect(priceHistory.low).toBeOneOf([null, expect.any(Number)])
        expect(priceHistory.close).toBeOneOf([null, expect.any(Number)])
        expect(priceHistory.volume).toEqual(expect.any(Number))
      }
      expect(data.size).toEqual(expect.any(Number))
      expect(data.totalCount).toEqual(expect.any(Number))
      expect(data.totalPages).toEqual(expect.any(Number))
    })
  })
})
