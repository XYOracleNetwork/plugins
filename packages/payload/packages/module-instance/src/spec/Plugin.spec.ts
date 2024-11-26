import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { ModuleInstancePayloadPlugin } from '../Plugin.ts'

describe('ModuleInstancePayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = ModuleInstancePayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
