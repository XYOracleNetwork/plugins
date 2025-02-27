import '@xylabs/vitest-extended'

import { ApiCallResult } from '@xyo-network/api-call-witness'
import {
  describe, expect,
  it,
} from 'vitest'

import { tryMapToSnapshot } from '../tryMapToSnapshot.ts'

describe('mapToPublicSnapshot', () => {
  describe('with successful response', () => {
    const cases: ApiCallResult[] = [
      {
        call: 'bae563e08bfa3030815cba08fad61237355e147aa41f9912b7321dadcb9a0085',
        contentType: 'application/json',
        data: {
          askPrice: 0.25,
          askPriceRate: null,
          askQtyBookTotal: 54_213,
          askQuantity: 13_370,
          bidPrice: 0.23,
          bidPriceRate: null,
          bidQtyBookTotal: 36_048,
          bidQuantity: 1000,
          high: 0.25,
          lastPrice: 0.23,
          lastQuantity: 1000,
          low: 0.23,
          open: 0.25,
          prevClosePx: 0.25,
          symbol: 'XYLB',
          timestamp: '2024-05-29T17:41:16.944090431-04:00',
          volume: 1002,
        },
        schema: 'network.xyo.api.call.result',
      },
    ]
    it.each(cases)('maps to Public Snapshot', (response) => {
      const result = tryMapToSnapshot(response)
      expect(result).toBeDefined()
    })
  })
  describe('with unsuccessful response', () => {
    const cases: ApiCallResult[] = [
      {
        call: 'a04445ce5b67bca9bf1da8d2f85eea60c9baf566342cf29ffd3bdfbb01c8fcfe',
        http: { status: 404 },
        schema: 'network.xyo.api.call.result',
      },
    ]
    it.each(cases)('maps to Public Snapshot', (response) => {
      const result = tryMapToSnapshot(response)
      expect(result).toBeUndefined()
    })
  })
})
