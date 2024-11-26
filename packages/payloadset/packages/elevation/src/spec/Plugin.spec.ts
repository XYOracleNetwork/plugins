/**
 * @jest-environment jsdom
 */

// Polyfill TextDecoder
import 'fast-text-encoding'
import '@xylabs/vitest-extended'

import { ElevationSchema } from '@xyo-network/elevation-payload-plugin'
import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { ElevationPlugin } from '../Plugin.ts'
import { ElevationWitnessConfigSchema } from '../Witness.ts'

describe('ElevationPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = ElevationPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, { config: { schema: ElevationWitnessConfigSchema } })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
