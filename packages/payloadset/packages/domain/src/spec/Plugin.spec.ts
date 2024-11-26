import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { DomainPlugin } from '../Plugin.ts'

describe('DomainPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = DomainPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
