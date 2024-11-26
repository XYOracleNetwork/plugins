import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { CryptoCardsMovePlugin } from '../Plugin.ts'

describe.skip('CryptoCardsMovePlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = CryptoCardsMovePlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(await resolver.resolve(plugin.set)).toBeObject()
    const witness = await resolver.witness(plugin.set)
    expect(witness).toBeObject()
    // const observation = await witness?.observe()
    // expect(observation?.length).toBeGreaterThan(0)
  })
})
