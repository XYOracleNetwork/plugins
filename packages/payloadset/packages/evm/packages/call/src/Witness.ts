import type { JsonObject } from '@xylabs/sdk-js'
import {
  asEthAddress, assertEx, isHexZero,
} from '@xylabs/sdk-js'
import { getErc1822SlotStatus } from '@xyo-network/erc1822-witness'
import { getErc1967SlotStatus } from '@xyo-network/erc1967-witness'
import type { Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { AbstractEvmWitness } from '@xyo-network/witness-evm-abstract'
import type { InterfaceAbi } from 'ethers'
import { Contract } from 'ethers'

import type { EvmCallWitnessParams } from './model.ts'
import { EvmCallWitnessConfigSchema } from './model.ts'
import type {
  EvmCall, EvmCallResult,
  EvmCallSuccess,
} from './Payload.ts'
import { EvmCallResultSchema, EvmCallSchema } from './Payload.ts'

export class EvmCallWitness<TParams extends EvmCallWitnessParams = EvmCallWitnessParams> extends AbstractEvmWitness<TParams, EvmCall, EvmCallResult> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EvmCallWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EvmCallWitnessConfigSchema

  get abi() {
    return assertEx(this.config.abi, () => 'Missing abi') as InterfaceAbi
  }

  protected override async observeHandler(inPayloads: EvmCall[] = []): Promise<EvmCallResult[]> {
    await this.started('throw')
    // calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType<EvmCall>(EvmCallSchema)).map(async ({
          functionName, args, address, block: payloadBlock,
        }) => {
          const validatedAddress = asEthAddress(assertEx(address ?? this.config.address, () => 'Missing address'), true)
          const validatedFunctionName = assertEx(functionName ?? this.config.functionName, () => 'Missing address')
          const mergedArgs = [...(args ?? this.config.args ?? [])] as JsonObject[]

          const provider = await this.getProvider(true, true)

          const block = this.config.block ?? payloadBlock ?? (await provider.getBlockNumber())

          // Check if ERC-1967 Upgradeable
          const erc1967Status = await getErc1967SlotStatus(provider, validatedAddress, block)

          // Check if ERC-1822 Upgradeable
          const erc1822Status = await getErc1822SlotStatus(provider, validatedAddress, block)

          const implementation = isHexZero(erc1967Status.slots.implementation ?? '0x00') ? erc1822Status.implementation : erc1967Status.implementation

          const contract = new Contract(implementation, this.abi, provider)
          let transformedResult: unknown
          try {
            const result = await contract[validatedFunctionName](...mergedArgs)
            transformedResult = typeof result === 'bigint' ? `0x${result.toString(16)}` : result
          } catch {
            // const error = ex as Error & { code: string }
            // this.logger.error(`Error [${this.config.name}]: ${error.code} : ${error.message}`)
          }
          const observation: EvmCallSuccess = {
            address: validatedAddress,
            args: mergedArgs,
            block,
            chainId: Number((await provider.getNetwork()).chainId),
            functionName: validatedFunctionName,
            result: transformedResult,
            schema: EvmCallResultSchema,
          }
          if (implementation !== validatedAddress) {
            observation.implementation = implementation
          }
          // console.log(`observation: ${JSON.stringify(observation, null, 2)}`)
          return observation
        }),
      )
      return observations
    } catch (ex) {
      const error = ex as Error
      console.log(`Error [${this.config.name}]: ${error.message}`)
      throw error
    }
  }
}
