import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { LocationCertaintyPayloadPlugin } from '../Plugin.ts'

describe('LocationCertaintyPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = LocationCertaintyPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
