/* eslint-disable max-statements */
import { assertEx } from '@xylabs/assert'
import { describeIf } from '@xylabs/jest-helpers'
import { JsonObject, toJsonString } from '@xylabs/object'
import { HDWallet } from '@xyo-network/account'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { asWitnessInstance } from '@xyo-network/witness-model'

import { ApiCallJsonResult, ApiCallResultSchema, ApiCallSchema, ApiUriTemplateCall, isApiCallErrorResult } from '../Payload'
import { ApiCallWitness } from '../Witness'
import tzeroMarketdataManifest from './tzero-marketdata-snapshots-symbol.json'

describe('tZero', () => {
  const symbol = 'XYLB'

  const apiKey = process.env.TZERO_MARKETDATA_API_KEY

  describeIf(apiKey)('snapshots', () => {
    interface TZeroMarketdataSnapshotResponse extends JsonObject {
      askPrice: number | null
      askPriceRate: number | null
      askQtyBookTotal: number
      askQuantity: number | null
      bidPrice: number | null
      bidPriceRate: number | null
      bidQtyBookTotal: number | null
      bidQuantity: number | null
      high: number | null
      lastPrice: number | null
      lastQuantity: number | null
      low: number | null
      open: number | null
      prevClosePx: number | null
      symbol: string
      timestamp: string
      volume: number
    }

    it('specifying symbol', async () => {
      const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
      const wallet = await HDWallet.fromPhrase(mnemonic)
      const locator = new ModuleFactoryLocator()

      locator.register(
        new ModuleFactory(ApiCallWitness, {
          headers: { 'x-apikey': apiKey },
        }),
      )

      const manifest = new ManifestWrapper(tzeroMarketdataManifest as PackageManifestPayload, wallet, locator)

      const node = await manifest.loadNodeFromIndex(0)

      const mods = await node.resolve('*')

      expect(mods.length).toBeGreaterThan(1)

      const resolvedWitness = await node.resolve('ApiCallWitness')
      expect(resolvedWitness).toBeDefined()

      const witness = asWitnessInstance(resolvedWitness)
      expect(witness).toBeDefined()

      const sentinel = asSentinelInstance(await node.resolve('ApiCallSentinel'))
      expect(sentinel).toBeDefined()

      const call: ApiUriTemplateCall = { params: { symbol }, schema: ApiCallSchema }

      const report = await sentinel?.report([call])

      const apiCallResult = report?.find(isPayloadOfSchemaType<ApiCallJsonResult<TZeroMarketdataSnapshotResponse>>(ApiCallResultSchema))
      expect(apiCallResult).toBeDefined()
      console.log(`Result: ${toJsonString(apiCallResult, 10)}`)
      expect(isApiCallErrorResult(apiCallResult)).toBe(false)
      const data = assertEx(apiCallResult?.data)
      expect(data.askPrice).toEqual(expect.any(Number))
      expect(data.askPriceRate).toBeOneOf([null, expect.any(Number)])
      expect(data.askQtyBookTotal).toEqual(expect.any(Number))
      expect(data.askQuantity).toEqual(expect.any(Number))
      expect(data.bidPrice).toEqual(expect.any(Number))
      expect(data.bidPriceRate).toBeOneOf([null, expect.any(Number)])
      expect(data.bidQtyBookTotal).toEqual(expect.any(Number))
      expect(data.bidQuantity).toEqual(expect.any(Number))
      expect(data.high).toBeOneOf([null, expect.any(Number)])
      expect(data.lastPrice).toBeOneOf([null, expect.any(Number)])
      expect(data.lastQuantity).toBeOneOf([null, expect.any(Number)])
      expect(data.low).toBeOneOf([null, expect.any(Number)])
      expect(data.open).toBeOneOf([null, expect.any(Number)])
      expect(data.prevClosePx).toEqual(expect.any(Number))
      expect(data.symbol).toEqual(expect.any(String))
      expect(data.timestamp).toEqual(expect.any(String))
    })
  })
})
