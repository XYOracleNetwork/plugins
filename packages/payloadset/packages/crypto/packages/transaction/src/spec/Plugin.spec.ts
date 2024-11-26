import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { AddressTransactionHistoryPlugin } from '../Plugin.ts'

describe('AddressTransactionHistoryPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = AddressTransactionHistoryPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
