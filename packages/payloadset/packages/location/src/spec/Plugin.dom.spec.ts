import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { CurrentLocationWitnessConfigSchema } from '../Config.ts'
import { LocationPlugin } from '../Plugin.ts'

describe('LocationPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = LocationPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, {
      config: { schema: CurrentLocationWitnessConfigSchema },
      geolocation: navigator.geolocation,
    })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
