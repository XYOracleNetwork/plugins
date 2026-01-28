import { assertEx } from '@xylabs/assert'
import { creatableModule } from '@xyo-network/module-model'
import {
  asSchema, isPayloadOfSchemaType, Schema,
} from '@xyo-network/payload-model'
import {
  AbstractEvmWitness, EvmAddress, EvmAddressSchema, EvmWitnessConfig, EvmWitnessParams,
} from '@xyo-network/witness-evm-abstract'

import { EvmContract, EvmContractSchema } from './Payload.ts'

export const EvmContractWitnessConfigSchema = asSchema('network.xyo.evm.contract.witness.config', true)
export type EvmContractWitnessConfigSchema = typeof EvmContractWitnessConfigSchema

export type EvmContractWitnessConfig = EvmWitnessConfig<{ address?: string }, EvmContractWitnessConfigSchema>

export type EvmContractWitnessParams = EvmWitnessParams<EvmContractWitnessConfig>

@creatableModule<EvmContractWitness>()
export class EvmContractWitness<TParams extends EvmContractWitnessParams = EvmContractWitnessParams> extends AbstractEvmWitness<
  TParams,
  EvmAddress,
  EvmContract
> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EvmContractWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EvmContractWitnessConfigSchema

  protected override async observeHandler(inPayloads: EvmAddress[] = []): Promise<EvmContract[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType<EvmAddress>(EvmAddressSchema)).map(async ({ address }) => {
          const validatedAddress = assertEx(address ?? this.config.address, () => 'Missing address')

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
