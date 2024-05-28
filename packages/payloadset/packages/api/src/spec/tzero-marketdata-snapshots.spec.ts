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

  describeIf(apiKey)('snapshots', () => {
    type TZeroMarketdataSandboxResponse = JsonObject
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
      const call: ApiUriTemplateCall = { schema: ApiCallSchema }

      const report = await sentinel?.report([call])

      const apiCallResult = report?.find(isPayloadOfSchemaType<ApiCallJsonResult<TZeroMarketdataSandboxResponse>>(ApiCallResultSchema))
      expect(apiCallResult).toBeDefined()
      expect(isApiCallErrorResult(apiCallResult)).toBe(false)
    })
  })
})
