import { assertEx } from '@xylabs/assert'
import type { Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import type {
  EvmAddress, EvmWitnessConfig, EvmWitnessParams,
} from '@xyo-network/witness-evm-abstract'
import { AbstractEvmWitness, EvmAddressSchema } from '@xyo-network/witness-evm-abstract'

import { getErc1822SlotStatus } from './lib/index.ts'
import type { Erc1822Status } from './Payload.ts'
import { Erc1822StatusSchema } from './Payload.ts'

export const Erc1822WitnessConfigSchema = 'network.xyo.erc1822.witness.config'
export type Erc1822WitnessConfigSchema = typeof Erc1822WitnessConfigSchema

export type Erc1822WitnessConfig = EvmWitnessConfig<{ address?: string }, Erc1822WitnessConfigSchema>

export type Erc1822WitnessParams = EvmWitnessParams<Erc1822WitnessConfig>

export class Erc1822Witness<TParams extends Erc1822WitnessParams = Erc1822WitnessParams> extends AbstractEvmWitness<
  TParams,
  EvmAddress,
  Erc1822Status
> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, Erc1822WitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = Erc1822WitnessConfigSchema

  protected override async observeHandler(inPayloads: EvmAddress[] = []): Promise<Erc1822Status[]> {
    await this.started('throw')
    // calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(EvmAddressSchema)).map(async ({ address }) => {
          const validatedAddress = assertEx(address ?? this.config.address, () => 'Missing address').toLowerCase()

          const provider = await this.getProvider(true, true)

          const block = await provider.getBlockNumber()

          const { implementation, slots } = await getErc1822SlotStatus(provider, validatedAddress, block)

          const observation: Erc1822Status = {
            address: validatedAddress,
            block,
            chainId: Number((await provider.getNetwork()).chainId),
            implementation,
            schema: Erc1822StatusSchema,
            slots,
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
