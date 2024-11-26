import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { EthereumGasEtherchainV2Plugin } from '../Plugin.ts'

describe('EthereumGasEtherchainV2Plugin', () => {
  test('Add to Resolver', async () => {
    const plugin = EthereumGasEtherchainV2Plugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
