import '@xylabs/vitest-extended'

import { assertEx } from '@xylabs/assert'
import type { ApiCallWitnessParams, ApiUriTemplateCallPayload } from '@xyo-network/api-call-witness'
import { ApiCallSchema, ApiCallWitness } from '@xyo-network/api-call-witness'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { SentinelInstance } from '@xyo-network/sentinel-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { isSnapshot } from '@xyo-network/tzero-stock-market-payload-plugin'
import { HDWallet } from '@xyo-network/wallet'
import { asWitnessInstance } from '@xyo-network/witness-model'
import {
  beforeAll, describe, expect, it,
} from 'vitest'

import { TZeroApiCallJsonResultToSnapshotDiviner } from '../Diviner.ts'
import tzeroMarketdataManifest from './ApiCallWitnessManifest.json' with { type: 'json' }

describe('tZero', () => {
  const symbol = 'XYLB'
  const apiKey = process.env.TZERO_MARKETDATA_API_KEY
  describe.skipIf(!apiKey)('snapshots', () => {
    let sentinel: SentinelInstance
    beforeAll(async () => {
      const wallet = await HDWallet.random()
      const locator = new ModuleFactoryLocator()
      locator.register(new ModuleFactory(ApiCallWitness, { config: {}, headers: { 'x-apikey': apiKey } } as ApiCallWitnessParams))
      locator.register(TZeroApiCallJsonResultToSnapshotDiviner.factory())
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
      const call: ApiUriTemplateCallPayload = { params: { symbol }, schema: ApiCallSchema }

      const report = await sentinel?.report([call])

      const data = report?.find(isSnapshot)
      expect(data).toBeDefined()
      expect(data?.askPrice === null || typeof data?.askPrice === 'number').toBe(true)
      expect(data?.askPriceRate === null || typeof data?.askPriceRate === 'number').toBe(true)
      expect(data?.askQtyBookTotal === null || typeof data?.askQtyBookTotal === 'number').toBe(true)
      expect(data?.askQuantity === null || typeof data?.askQuantity === 'number').toBe(true)
      expect(data?.bidPrice === null || typeof data?.bidPrice === 'number').toBe(true)
      expect(data?.bidPriceRate === null || typeof data?.bidPriceRate === 'number').toBe(true)
      expect(data?.bidQtyBookTotal === null || typeof data?.bidQtyBookTotal === 'number').toBe(true)
      expect(data?.bidQuantity === null || typeof data?.bidQuantity === 'number').toBe(true)
      expect(data?.high === null || typeof data?.high === 'number').toBe(true)
      expect(data?.lastPrice === null || typeof data?.lastPrice === 'number').toBe(true)
      expect(data?.lastQuantity === null || typeof data?.lastQuantity === 'number').toBe(true)
      expect(data?.low === null || typeof data?.low === 'number').toBe(true)
      expect(data?.open === null || typeof data?.open === 'number').toBe(true)
      expect(typeof data?.prevClosePx === 'number').toBe(true)
      expect(typeof data?.symbol === 'string').toBe(true)
      expect(typeof data?.timestamp === 'string').toBe(true)
      expect(typeof data?.volume === 'number').toBe(true)
    })
  })
})
