import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { ElevationPayloadPlugin } from '../Plugin.ts'

describe('ElevationPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = ElevationPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
