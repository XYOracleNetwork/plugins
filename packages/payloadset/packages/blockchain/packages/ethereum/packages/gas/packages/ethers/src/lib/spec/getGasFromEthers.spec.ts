import '@xylabs/vitest-extended'

import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect,
  test,
} from 'vitest'

import { getGasFromEthers } from '../getGasFromEthers.ts'

const projectId = process.env.INFURA_PROJECT_ID || ''
const projectSecret = process.env.INFURA_PROJECT_SECRET || ''

describe('getGasFromEthers', () => {
  test.skipIf(!projectId || !projectSecret)('returns prices', async () => {
    const provider = getProviderFromEnv()
    const result = await getGasFromEthers(provider)
    expect(result).toBeObject()
    expect(result.gasPrice).toBeNumber()
    expect(result.maxFeePerGas).toBeNumber()
    expect(result.maxPriorityFeePerGas).toBeNumber()
  })
})
