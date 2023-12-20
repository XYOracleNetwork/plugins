import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { hexFromBigInt } from '@xylabs/hex'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { AbstractBlockchainWitness } from '@xyo-network/witness-blockchain-abstract'
import { Contract, EventLog } from 'ethers'

import { EvmEventsWitnessConfigSchema, EvmEventsWitnessParams } from './model'
import { EvmEvent, EvmEvents, EvmEventSchema, EvmEventsSchema } from './Payload'

const bigIntArrayToHexString = (items: unknown[]) => {
  return items.map((item) => {
    if (typeof item === 'bigint') {
      return hexFromBigInt(item)
    }
    return item
  })
}

export class EvmEventsWitness<TParams extends EvmEventsWitnessParams = EvmEventsWitnessParams> extends AbstractBlockchainWitness<
  TParams,
  EvmEvents,
  EvmEvent
> {
  static override configSchemas = [EvmEventsWitnessConfigSchema]

  get abi() {
    return assertEx(this.config.abi, 'Missing abi')
  }

  protected override async observeHandler(inPayloads: EvmEvents[] = []): Promise<EvmEvent[]> {
    await this.started('throw')
    //calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = (
        await Promise.all(
          inPayloads
            .filter(isPayloadOfSchemaType<EvmEvents>(EvmEventsSchema))
            .map(async ({ eventName, address, fromBlock: payloadFromBlock, toBlock: payloadToBlock }) => {
              const validatedAddress = assertEx(address ?? this.config.address, 'Missing address')
              const validatedEventName = assertEx(eventName ?? this.config.eventName, 'Missing eventName')

              const provider = await this.getProvider(true, true)
              const network = await provider.getNetwork()

              const contract = new Contract(validatedAddress, this.abi, provider)

              const abiArray = assertEx(Array.isArray(this.abi) ? this.abi : undefined, 'Abi is not an array')

              const abiEvent = assertEx(
                abiArray.find((entry) => entry.type === 'event' && entry.name === validatedEventName),
                'Could not find event',
              )

              const fromBlock = this.config.fromBlock ?? payloadFromBlock ?? contract.deploymentTransaction()?.blockNumber ?? undefined
              const toBlock = this.config.toBlock ?? payloadToBlock ?? (await provider.getBlockNumber())

              const rawEvents = await contract.queryFilter(contract.filters[validatedEventName], fromBlock, toBlock)

              const observation = rawEvents
                .map((rawLog) => {
                  const rawEvent = rawLog as EventLog
                  if (rawEvent.args) {
                    const argsObject: Record<string, unknown> = {}

                    abiEvent.inputs.map((input: { name: string }, index: number) => {
                      const value = rawEvent.args[index]
                      if (typeof value === 'bigint') {
                        argsObject[input.name] = hexFromBigInt(value)
                      } else {
                        argsObject[input.name] = value
                      }
                    })

                    const eventResult: EvmEvent = {
                      address: rawEvent.address,
                      args: argsObject,
                      block: rawEvent.blockNumber,
                      chainId: Number(network.chainId),
                      eventName: validatedEventName,
                      schema: EvmEventSchema,
                    }
                    return eventResult
                  }
                })
                .filter(exists)

              console.log(`observation: ${JSON.stringify(observation, null, 2)}`)
              return observation
            }),
        )
      ).flat()
      return observations
    } catch (ex) {
      const error = ex as Error
      console.log(`Error [${this.config.name}]: ${error.message}`)
      throw error
    }
  }
}
