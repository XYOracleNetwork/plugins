import '@xylabs/vitest-extended'

import { assertEx } from '@xylabs/assert'
import { HDWallet } from '@xyo-network/account'
import type { ApiUriTemplateCall } from '@xyo-network/api-call-witness'
import { ApiCallSchema, ApiCallWitness } from '@xyo-network/api-call-witness'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { SentinelInstance } from '@xyo-network/sentinel-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { isSnapshot } from '@xyo-network/tzero-stock-market-payload-plugin'
import { asWitnessInstance } from '@xyo-network/witness-model'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

import { TZeroApiCallJsonResultToSnapshotDiviner } from '../Diviner.ts'
import tzeroMarketdataManifest from './ApiCallWitnessManifest.json' assert { type: 'json' }

describe('tZero', () => {
  const symbol = 'XYLB'
  const apiKey = process.env.TZERO_MARKETDATA_API_KEY
  describe.skipIf(!apiKey)('snapshots', () => {
    let sentinel: SentinelInstance
    beforeAll(async () => {
      const wallet = await HDWallet.random()
      const locator = new ModuleFactoryLocator()
      locator.register(new ModuleFactory(ApiCallWitness, { headers: { 'x-apikey': apiKey } }))
      locator.register(TZeroApiCallJsonResultToSnapshotDiviner)
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

    // eslint-disable-next-line complexity
    it('specifying symbol', async () => {
      const call: ApiUriTemplateCall = { params: { symbol }, schema: ApiCallSchema }

      const report = await sentinel?.report([call])

      const data = report?.find(isSnapshot)
      expect(data).toBeDefined()
      expect(data?.askPrice).toBeOneOf([null, expect.any(Number)])
      expect(data?.askPriceRate).toBeOneOf([null, expect.any(Number)])
      expect(data?.askQtyBookTotal).toBeOneOf([null, expect.any(Number)])
      expect(data?.askQuantity).toBeOneOf([null, expect.any(Number)])
      expect(data?.bidPrice).toBeOneOf([null, expect.any(Number)])
      expect(data?.bidPriceRate).toBeOneOf([null, expect.any(Number)])
      expect(data?.bidQtyBookTotal).toBeOneOf([null, expect.any(Number)])
      expect(data?.bidQuantity).toBeOneOf([null, expect.any(Number)])
      expect(data?.high).toBeOneOf([null, expect.any(Number)])
      expect(data?.lastPrice).toBeOneOf([null, expect.any(Number)])
      expect(data?.lastQuantity).toBeOneOf([null, expect.any(Number)])
      expect(data?.low).toBeOneOf([null, expect.any(Number)])
      expect(data?.open).toBeOneOf([null, expect.any(Number)])
      expect(data?.prevClosePx).toEqual(expect.any(Number))
      expect(data?.symbol).toEqual(expect.any(String))
      expect(data?.timestamp).toEqual(expect.any(String))
      expect(data?.volume).toEqual(expect.any(Number))
    })
  })
})
