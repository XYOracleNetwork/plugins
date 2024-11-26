import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { EthereumGasEtherscanPlugin } from '../Plugin.ts'
import { EthereumGasEtherscanWitness } from '../Witness.ts'

const apiKey = process.env.ETHERSCAN_API_KEY || ''

describe('EthereumGasEtherscanPlugin', () => {
  test.skipIf(!apiKey)('Add to Resolver', async () => {
    const plugin = EthereumGasEtherscanPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, { config: { apiKey, schema: EthereumGasEtherscanWitness.defaultConfigSchema } })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
