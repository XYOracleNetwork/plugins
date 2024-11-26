import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { PentairScreenlogicPlugin } from '../Plugin.ts'
import { PentairScreenlogicWitnessConfigSchema } from '../Witness.ts'

describe('PentairScreenlogicPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = PentairScreenlogicPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, { config: { schema: PentairScreenlogicWitnessConfigSchema } })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
