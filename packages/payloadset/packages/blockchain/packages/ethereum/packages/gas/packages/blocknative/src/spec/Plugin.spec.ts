import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { EthereumGasBlocknativePlugin } from '../Plugin.ts'
import { EthereumGasBlocknativeWitness } from '../Witness.ts'

describe('EthereumGasBlocknativePlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = EthereumGasBlocknativePlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, { config: { schema: EthereumGasBlocknativeWitness.defaultConfigSchema } })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
