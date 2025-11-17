/* eslint-disable sonarjs/deprecation */
import '@xylabs/vitest-extended'

import type { CryptoContractFunctionCall, CryptoContractFunctionCallResult } from '@xyo-network/crypto-contract-function-read-payload-plugin'
import {
  CryptoContractFunctionCallResultSchema,
  CryptoContractFunctionCallSchema,
  CryptoContractFunctionReadWitnessConfigSchema,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { ERC20__factory } from '@xyo-network/open-zeppelin-typechain'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect,
  it,
} from 'vitest'

import { CryptoContractFunctionReadWitness } from '../Witness.ts'

const validateObservation = (observation: Payload[]) => {
  const results = observation.filter(isPayloadOfSchemaType<CryptoContractFunctionCallResult>(CryptoContractFunctionCallResultSchema))
  expect(results.length).toBeGreaterThan(0)
  expect(observation.length).toEqual(results.length)
}

describe.skipIf(!process.env.INFURA_PROJECT_ID)('CryptoWalletNftWitness', () => {
  const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' // XYO ERC20
  const functionName = 'balanceOf'
  const args = ['0xaDe7DFBC532A01dB67BFEA3b728D4eA22869f381'] // Random Holder
  const provider = getProviderFromEnv()
  describe('observe', () => {
    describe('with no address or chainId in query', () => {
      it('uses values from config', async () => {
        const witness = await CryptoContractFunctionReadWitness.create({
          config: { abi: ERC20__factory.abi, schema: CryptoContractFunctionReadWitnessConfigSchema },
          providers: [provider],
        })
        const call: CryptoContractFunctionCall = {
          address, args, functionName, schema: CryptoContractFunctionCallSchema,
        }
        const observation = await witness.observe([call])
        validateObservation(observation)
      })
    })
  })
})
