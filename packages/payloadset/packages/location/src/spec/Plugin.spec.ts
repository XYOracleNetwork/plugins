/**
 * @jest-environment jsdom
 */

import { CurrentLocationSchema } from '@xyo-network/location-payload-plugin'
import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'

import { CurrentLocationWitnessConfigSchema } from '../Config'
import { LocationPlugin } from '../Plugin'

describe('LocationPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = LocationPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, {
      config: {
        schema: CurrentLocationWitnessConfigSchema,
      },
      geolocation: navigator.geolocation,
    })
    expect(resolver.resolve(plugin.set)).toBeObject()
    expect(resolver.witness(CurrentLocationSchema)).toBeObject()
  })
})
