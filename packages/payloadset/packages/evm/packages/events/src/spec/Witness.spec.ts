import { describeIf } from '@xylabs/jest-helpers'
import { ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'

import { EvmEventsWitnessConfigSchema } from '../model'
import type { EvmEvents } from '../Payload'
import { EvmEventSchema, EvmEventsSchema } from '../Payload'
import { EvmEventsWitness } from '../Witness'

const validateObservation = (observation: Payload[]) => {
  const results = observation.filter(isPayloadOfSchemaType(EvmEventSchema))
  expect(results.length).toBeGreaterThan(0)
  expect(observation.length).toEqual(results.length)
}

describeIf(process.env.INFURA_PROJECT_ID)('EvmEventsWitness', () => {
  const address = '0x6811f2f20c42f42656a3c8623ad5e9461b83f719' // ParallelPlanetFall
  const eventName = 'TransferSingle'
  describe('observe', () => {
    describe('with no address or chainId in query', () => {
      it('uses values from config', async () => {
        const witness = await EvmEventsWitness.create({
          account: 'random',
          config: { abi: ERC1155__factory.abi, fromBlock: 19_180_000, schema: EvmEventsWitnessConfigSchema },
          providers: getProvidersFromEnv,
        })
        const call: EvmEvents = { address, eventName, schema: EvmEventsSchema }
        const observation = await witness.observe([call])
        validateObservation(observation)
      })
    })
  })
})
