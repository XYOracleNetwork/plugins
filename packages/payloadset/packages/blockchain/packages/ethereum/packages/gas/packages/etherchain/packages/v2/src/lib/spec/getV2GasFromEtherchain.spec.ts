import '@xylabs/vitest-extended'

import {
  describe, expect,
  test,
} from 'vitest'

import { getV2GasFromEtherchain } from '../getV2GasFromEtherchain.ts'

describe('getV2GasFromEtherchain', () => {
  test('returns prices', async () => {
    const gas = await getV2GasFromEtherchain()
    expect(gas).toBeObject()
    expect(gas.code).toBeNumber()
    expect(gas.data).toBeObject()
    expect(gas.data.fast).toBeNumber()
    expect(gas.data.priceUSD).toBeNumber()
    expect(gas.data.rapid).toBeNumber()
    expect(gas.data.slow).toBeNumber()
    expect(gas.data.standard).toBeNumber()
    expect(gas.data.timestamp).toBeNumber()
  })
})
