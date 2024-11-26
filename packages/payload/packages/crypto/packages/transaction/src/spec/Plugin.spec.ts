import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { AddressTransactionHistoryPayloadPlugin } from '../Plugin.ts'

describe('AddressTransactionHistoryPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = AddressTransactionHistoryPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
