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
import tzeroMarketdataManifest from './tzero-marketdata-snapshots.json'

describe('tZero', () => {
  const apiKey = process.env.TZERO_MARKETDATA_API_KEY

  describeIf(apiKey)('public-snapshots', () => {
    interface Snapshot extends JsonObject {
      askPrice: number
      askPriceRate: number | null
      askQtyBookTotal: number
      askQuantity: number
      bidPrice: number
      bidPriceRate: number | null
      high: number | null
      lastPrice: number | null
      lastQuantity: number | null
      low: number | null
      open: number | null
      prevClosePx: number
      symbol: string
      timestamp: string
      volume: number
    }

    interface TZeroMarketdataSandboxResponse extends JsonObject {
      snapshots: Snapshot[]
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
    it('returns all public snapshots', async () => {
      const call: ApiUriTemplateCall = { schema: ApiCallSchema }

      const report = await sentinel?.report([call])

      const apiCallResult = report?.find(isPayloadOfSchemaType<ApiCallJsonResult<TZeroMarketdataSandboxResponse>>(ApiCallResultSchema))
      expect(apiCallResult).toBeDefined()
      expect(isApiCallErrorResult(apiCallResult)).toBe(false)
      expect(apiCallResult?.data).toBeObject()
      const data = assertEx(apiCallResult?.data)
      expect(data.snapshots).toBeArray()
      for (const snapshot of data.snapshots) {
        expect(snapshot.symbol).toEqual(expect.any(String))
        expect(snapshot.high).toBeOneOf([null, expect.any(Number)])
        expect(snapshot.low).toBeOneOf([null, expect.any(Number)])
        expect(snapshot.open).toBeOneOf([null, expect.any(Number)])
        expect(snapshot.volume).toEqual(expect.any(Number))
        expect(snapshot.lastPrice).toBeOneOf([null, expect.any(Number)])
        expect(snapshot.lastQuantity).toBeOneOf([null, expect.any(Number)])
        expect(snapshot.prevClosePx).toEqual(expect.any(Number))
        expect(snapshot.bidPrice).toEqual(expect.any(Number))
        expect(snapshot.bidPriceRate).toBeOneOf([null, expect.any(Number)])
        expect(snapshot.bidQuantity).toEqual(expect.any(Number))
        expect(snapshot.bidQtyBookTotal).toEqual(expect.any(Number))
        expect(snapshot.askPrice).toEqual(expect.any(Number))
        expect(snapshot.askPriceRate).toBeOneOf([null, expect.any(Number)])
        expect(snapshot.askQuantity).toEqual(expect.any(Number))
        expect(snapshot.askQtyBookTotal).toEqual(expect.any(Number))
        expect(snapshot.timestamp).toEqual(expect.any(String))
      }
    })
  })
})
