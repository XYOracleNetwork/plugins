import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { hexFromBigInt } from '@xylabs/hex'
import type { Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { AbstractEvmWitness } from '@xyo-network/witness-evm-abstract'
import type { EventLog } from 'ethers'
import { Contract } from 'ethers'

import type { EvmEventsWitnessParams } from './model.ts'
import { EvmEventsWitnessConfigSchema } from './model.ts'
import type { EvmEvent, EvmEvents } from './Payload.ts'
import { EvmEventSchema, EvmEventsSchema } from './Payload.ts'

export class EvmEventsWitness<TParams extends EvmEventsWitnessParams = EvmEventsWitnessParams> extends AbstractEvmWitness<
  TParams,
  EvmEvents,
  EvmEvent
> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EvmEventsWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EvmEventsWitnessConfigSchema

  get abi() {
    return assertEx(this.config.abi, () => 'Missing abi')
  }

  protected override async observeHandler(inPayloads: EvmEvents[] = []): Promise<EvmEvent[]> {
    await this.started('throw')
    // calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = (
        await Promise.all(
          inPayloads
            .filter(isPayloadOfSchemaType<EvmEvents>(EvmEventsSchema))
            .map(async ({ eventName, address, fromBlock: payloadFromBlock, toBlock: payloadToBlock }) => {
              const validatedAddress = assertEx(address ?? this.config.address, () => 'Missing address')
              const validatedEventName = assertEx(eventName ?? this.config.eventName, () => 'Missing eventName')

              const provider = await this.getProvider(true, true)
              const network = await provider.getNetwork()

              const contract = new Contract(validatedAddress, this.abi, provider).attach(validatedAddress)

              const abiArray = assertEx(Array.isArray(this.abi) ? this.abi : undefined, () => 'Abi is not an array')

              const abiEvent = assertEx(
                abiArray.find(entry => entry.type === 'event' && entry.name === validatedEventName),
                () => 'Could not find event',
              )

              const toBlock = this.config.toBlock ?? payloadToBlock ?? (await provider.getBlockNumber())
              const fromBlock = this.config.fromBlock ?? payloadFromBlock ?? 0

              const allRawEvents = await contract.queryFilter(contract.filters[validatedEventName], fromBlock, toBlock)
              // console.log(`from-to: ${fromBlock}|${toBlock} = ${allRawEvents.length}`)

              const observation = allRawEvents
                .map((rawLog) => {
                  const rawEvent = rawLog as EventLog
                  if (rawEvent.args) {
                    const argsObject: Record<string, unknown> = {}

                    abiEvent.inputs.map((input: { name: string }, index: number) => {
                      const value = rawEvent.args[index]
                      argsObject[input.name] = typeof value === 'bigint' ? hexFromBigInt(value) : value
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
