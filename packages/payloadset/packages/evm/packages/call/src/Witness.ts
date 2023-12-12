import { assertEx } from '@xylabs/assert'
import { getErc1822SlotStatus } from '@xyo-network/erc1822-witness'
import { getErc1967SlotStatus } from '@xyo-network/erc1967-witness'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { AbstractBlockchainWitness, BlockchainWitnessConfig, BlockchainWitnessParams } from '@xyo-network/witness-blockchain-abstract'
import { Contract, JsonFragment } from 'ethers'

import { EvmCall, EvmCallResult, EvmCallResultSchema, EvmCallSchema, EvmCallSuccess } from './Payload'

export type Abi = string | ReadonlyArray<JsonFragment | string>

export const EvmCallWitnessConfigSchema = 'network.xyo.evm.call.witness.config'
export type EvmCallWitnessConfigSchema = typeof EvmCallWitnessConfigSchema

export type EvmCallWitnessConfig = BlockchainWitnessConfig<
  {
    abi?: Abi
    address?: string
    args?: unknown[]
    block?: number
    functionName?: string
  },
  EvmCallWitnessConfigSchema
>

export type EvmCallWitnessParams = BlockchainWitnessParams<EvmCallWitnessConfig>

const prefixHex = (value?: string) => {
  if (value !== undefined) {
    const lowerValue = value.toLowerCase()
    return lowerValue.startsWith('0x') ? lowerValue : `0x${lowerValue}`
  }
}

const isHexZero = (value?: string) => {
  const prefixedValue = prefixHex(value)
  return prefixedValue === undefined ? true : BigInt(prefixedValue) === 0n
}

export class EvmCallWitness<TParams extends EvmCallWitnessParams = EvmCallWitnessParams> extends AbstractBlockchainWitness<
  TParams,
  EvmCall,
  EvmCallResult
> {
  static override configSchemas = [EvmCallWitnessConfigSchema]

  get abi() {
    return assertEx(this.config.abi, 'Missing abi')
  }

  protected override async observeHandler(inPayloads: EvmCall[] = []): Promise<EvmCallResult[]> {
    await this.started('throw')
    //calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(EvmCallSchema)).map(async ({ functionName, args, address, block: payloadBlock }) => {
          const validatedAddress = assertEx(address ?? this.config.address, 'Missing address')
          const validatedFunctionName = assertEx(functionName ?? this.config.functionName, 'Missing address')
          const mergedArgs = [...(args ?? this.config.args ?? [])]

          const provider = await this.getProvider(true, true)

          const block = this.config.block ?? payloadBlock ?? (await provider.getBlockNumber())

          //Check if ERC-1967 Upgradeable
          const erc1967Status = await getErc1967SlotStatus(provider, validatedAddress, block)

          //Check if ERC-1822 Upgradeable
          const erc1822Status = await getErc1822SlotStatus(provider, validatedAddress, block)

          const implementation = isHexZero(erc1967Status.slots.implementation) ? erc1822Status.implementation : erc1967Status.implementation

          const contract = new Contract(implementation, this.abi, provider)
          let transformedResult: unknown
          try {
            const result = await contract[validatedFunctionName](...mergedArgs)
            transformedResult = typeof result === 'bigint' ? `0x${result.toString(16)}` : result
          } catch (ex) {
            //const error = ex as Error & { code: string }
            //this.logger.error(`Error [${this.config.name}]: ${error.code} : ${error.message}`)
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
          console.log(`observation: ${JSON.stringify(observation, null, 2)}`)
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
