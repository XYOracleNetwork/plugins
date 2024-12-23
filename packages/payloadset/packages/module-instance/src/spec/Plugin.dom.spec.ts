import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { AbstractModuleInstancePlugin } from '../Plugin.ts'
import { AbstractModuleInstanceWitnessConfigSchema } from '../Witness.ts'

describe('AbstractModuleInstancePlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = AbstractModuleInstancePlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, { config: { schema: AbstractModuleInstanceWitnessConfigSchema } })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
