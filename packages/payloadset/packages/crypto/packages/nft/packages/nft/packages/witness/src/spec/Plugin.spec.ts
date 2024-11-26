import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { CryptoWalletNftWitnessPlugin } from '../Plugin.ts'

describe('CryptoWalletNftWitnessPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = CryptoWalletNftWitnessPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
