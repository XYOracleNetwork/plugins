/**
 * @jest-environment jsdom
 */

// Polyfill TextDecoder
import 'fast-text-encoding'

import { ElevationSchema } from '@xyo-network/elevation-payload-plugin'
import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'

import { ElevationPlugin } from '../Plugin.ts'
import { ElevationWitnessConfigSchema } from '../Witness.ts'

describe('ElevationPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = ElevationPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, { config: { schema: ElevationWitnessConfigSchema } })
    expect(resolver.resolve(plugin.set)).toBeObject()
    expect(resolver.witness(ElevationSchema)).toBeObject()
  })
})
