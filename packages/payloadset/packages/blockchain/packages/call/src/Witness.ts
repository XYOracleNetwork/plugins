import { assertEx } from '@xylabs/assert'
import { BigNumber as XyBigNumber } from '@xylabs/bignumber'
import { getErc1822Status } from '@xyo-network/blockchain-erc1822-witness'
import { getErc1967Status } from '@xyo-network/blockchain-erc1967-witness'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { AbstractBlockchainWitness, BlockchainWitnessConfig, BlockchainWitnessParams } from '@xyo-network/witness-blockchain-abstract'
import { Contract, JsonFragment } from 'ethers'

import {
  BlockchainContractCall,
  BlockchainContractCallResult,
  BlockchainContractCallResultSchema,
  BlockchainContractCallSchema,
  BlockchainContractCallSuccess,
} from './Payload'

export type Abi = string | ReadonlyArray<JsonFragment | string>

export const BlockchainContractCallWitnessConfigSchema = 'network.xyo.blockchain.contract.call.witness.config'
export type BlockchainContractCallWitnessConfigSchema = typeof BlockchainContractCallWitnessConfigSchema

export type BlockchainContractCallWitnessConfig = BlockchainWitnessConfig<
  {
    abi?: Abi
    address?: string
    args?: unknown[]
    block?: number
    functionName?: string
  },
  BlockchainContractCallWitnessConfigSchema
>

export type BlockchainContractCallWitnessParams = BlockchainWitnessParams<BlockchainContractCallWitnessConfig>

const hexBytesOnlyOnly = (value: string) => {
  return value.startsWith('0x') ? value.substring(2) : value
}

const isHexZero = (value?: string) => {
  return value === undefined ? true : new XyBigNumber(hexBytesOnlyOnly(value), 'hex').eqn(0)
}

export class BlockchainContractCallWitness<
  TParams extends BlockchainContractCallWitnessParams = BlockchainContractCallWitnessParams,
> extends AbstractBlockchainWitness<TParams, BlockchainContractCall, BlockchainContractCallResult> {
  static override configSchemas = [BlockchainContractCallWitnessConfigSchema]

  get abi() {
    return assertEx(this.config.abi, 'Missing abi')
  }

  protected override async observeHandler(inPayloads: BlockchainContractCall[] = []): Promise<BlockchainContractCallResult[]> {
    await this.started('throw')
    //calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(BlockchainContractCallSchema)).map(async ({ functionName, args, address, block: payloadBlock }) => {
          const validatedAddress = assertEx(address ?? this.config.address, 'Missing address')
          const validatedFunctionName = assertEx(functionName ?? this.config.functionName, 'Missing address')
          const mergedArgs = [...(args ?? this.config.args ?? [])]

          const provider = await this.getProvider(true, true)

          const block = this.config.block ?? payloadBlock ?? (await provider.getBlockNumber())

          //Check if ERC-1967 Upgradeable
          const erc1967Status = await getErc1967Status(provider, validatedAddress, block)

          //Check if ERC-1822 Upgradeable
          const erc1822Status = await getErc1822Status(provider, validatedAddress, block)

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
          const observation: BlockchainContractCallSuccess = {
            address: validatedAddress,
            args: mergedArgs,
            block,
            chainId: Number((await provider.getNetwork()).chainId),
            functionName: validatedFunctionName,
            result: transformedResult,
            schema: BlockchainContractCallResultSchema,
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
