// import { PendingBlockNumber } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'

import '@xylabs/vitest-extended'

import {
  describe, expect,
  test,
} from 'vitest'

import { getGasFromBlocknative } from '../getGasFromBlocknative.ts'

describe('getGasFromBlocknative', () => {
  test('returns prices', async () => {
    const result = await getGasFromBlocknative()
    expect(result).toBeObject()
    expect(result?.blockPrices).toBeArrayOfSize(1)
    for (let blockPrice of result.blockPrices) {
      expect(blockPrice.baseFeePerGas).toBeNumber()
      expect(blockPrice.blockNumber).toBeNumber()
      expect(blockPrice.estimatedPrices).toBeArrayOfSize(5)
      for (let estimatedPrice of blockPrice.estimatedPrices) {
        expect(estimatedPrice?.confidence).toBeNumber()
        expect(estimatedPrice?.maxFeePerGas).toBeNumber()
        expect(estimatedPrice?.maxPriorityFeePerGas).toBeNumber()
        expect(estimatedPrice?.price).toBeNumber()
      }
      expect(blockPrice.estimatedTransactionCount).toBeNumber()
    }
    /* expect(result?.estimatedBaseFees).toBeArrayOfSize(5)
    for (let index = 0; index < result?.estimatedBaseFees.length; index++) {
      const blockNumber = `pending+${index + 1}` as PendingBlockNumber
      const pendingBlockInfo = result.estimatedBaseFees?.[index]?.[blockNumber]
      expect(pendingBlockInfo.length).toBeGreaterThan(0)
      const pendingBlock = pendingBlockInfo?.[0]
      expect(pendingBlock).toBeObject()
      expect(pendingBlock?.baseFee).toBeNumber()
      expect(pendingBlock?.confidence).toBeNumber()
    } */
    expect(result?.currentBlockNumber).toBeNumber()
    expect(result?.maxPrice).toBeNumber()
    expect(result?.msSinceLastBlock).toBeNumber()
    expect(result?.network).toEqual('main')
    expect(result?.system).toEqual('ethereum')
    expect(result?.unit).toEqual('gwei')
  })
})
