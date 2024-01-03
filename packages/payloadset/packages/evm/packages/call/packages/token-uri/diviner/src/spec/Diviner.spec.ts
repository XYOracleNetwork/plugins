import { describeIf } from '@xylabs/jest-helpers'
import { ERC20__factory } from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'

import { EvmCallDiviner } from '../Diviner'
import { EvmCall, EvmCallResultSchema, EvmCallSchema } from '../Payload'

const validateObservation = (observation: Payload[]) => {
  const results = observation.filter(isPayloadOfSchemaType(EvmCallResultSchema))
  expect(results.length).toBeGreaterThan(0)
  expect(observation.length).toEqual(results.length)
}

describeIf(process.env.INFURA_PROJECT_ID)('CryptoWalletNftDiviner', () => {
  const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' //XYO ERC20
  const functionName = 'balanceOf'
  const args = ['0xaDe7DFBC532A01dB67BFEA3b728D4eA22869f381'] //Random Holder
  describe('observe', () => {
    describe('with no address or chainId in query', () => {
      it('uses values from config', async () => {
        const witness = await EvmCallDiviner.create({
          account: 'random',
          config: { schema: EvmCallDivinerConfigSchema },
        })
        const call: EvmCall = { address, args, functionName, schema: EvmCallSchema }
        const observation = await witness.divine([call])
        validateObservation(observation)
      })
    })
  })
})
