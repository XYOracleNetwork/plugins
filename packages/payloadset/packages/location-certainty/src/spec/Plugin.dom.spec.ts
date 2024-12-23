// Polyfill TextDecoder
import 'fast-text-encoding'
import '@xylabs/vitest-extended'

import { LocationCertaintySchema } from '@xyo-network/location-certainty-payload-plugin'
import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { LocationCertaintyDivinerConfigSchema } from '../Diviner/index.ts'
import { LocationCertaintyPlugin } from '../Plugin.ts'

describe('LocationCertaintyPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = LocationCertaintyPlugin()
    const resolver = await new PayloadSetPluginResolver()
      .register(plugin, { config: { schema: LocationCertaintyDivinerConfigSchema, targetSchema: LocationCertaintySchema } })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.diviner(plugin.set)).toBeObject()
  })
})
