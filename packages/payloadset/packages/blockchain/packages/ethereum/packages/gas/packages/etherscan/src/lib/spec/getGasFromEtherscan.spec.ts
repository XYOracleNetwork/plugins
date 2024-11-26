import '@xylabs/vitest-extended'

import {
  describe, expect,
  test,
} from 'vitest'

import { getGasFromEtherscan } from '../getGasFromEtherscan.ts'

const apiKey = process.env.ETHERSCAN_API_KEY || ''

describe('getGasFromEtherscan', () => {
  test.skipIf(!apiKey)('returns prices', async () => {
    const gas = await getGasFromEtherscan(apiKey)
    expect(gas).toBeTruthy()
    expect(gas.status).toEqual('1')
    expect(gas.message).toEqual('OK')
    expect(gas.result).toBeObject()
    expect(gas.result.FastGasPrice).toBeString()
    expect(gas.result.LastBlock).toBeString()
    expect(gas.result.ProposeGasPrice).toBeString()
    expect(gas.result.SafeGasPrice).toBeString()
    expect(gas.result.gasUsedRatio).toBeString()
    expect(gas.result.suggestBaseFee).toBeString()
  })
})
