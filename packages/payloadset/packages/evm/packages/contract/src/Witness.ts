import { assertEx } from '@xylabs/assert'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import {
  AbstractBlockchainWitness,
  BlockchainAddress,
  BlockchainAddressSchema,
  BlockchainWitnessConfig,
  BlockchainWitnessParams,
} from '@xyo-network/witness-blockchain-abstract'

import { EvmContract, EvmContractSchema } from './Payload'

export const EvmContractWitnessConfigSchema = 'network.xyo.evm.contract.witness.config'
export type EvmContractWitnessConfigSchema = typeof EvmContractWitnessConfigSchema

export type EvmContractWitnessConfig = BlockchainWitnessConfig<{ address?: string }, EvmContractWitnessConfigSchema>

export type EvmContractWitnessParams = BlockchainWitnessParams<EvmContractWitnessConfig>

export class EvmContractWitness<TParams extends EvmContractWitnessParams = EvmContractWitnessParams> extends AbstractBlockchainWitness<
  TParams,
  BlockchainAddress,
  EvmContract
> {
  static override configSchemas = [EvmContractWitnessConfigSchema]

  protected override async observeHandler(inPayloads: BlockchainAddress[] = []): Promise<EvmContract[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(BlockchainAddressSchema)).map(async ({ address }) => {
          const validatedAddress = assertEx(address ?? this.config.address, 'Missing address')

          const provider = await this.getProvider(true, true)

          const block = await provider.getBlockNumber()
          const code = await provider.getCode(validatedAddress, block)

          const observation: EvmContract = {
            address: validatedAddress,
            block,
            chainId: Number((await provider.getNetwork()).chainId),
            code,
            schema: EvmContractSchema,
          }
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
