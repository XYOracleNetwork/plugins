import { assertEx } from '@xylabs/assert'
import { Address } from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { AbstractEvmWitness, EvmAddress, EvmAddressSchema, EvmWitnessConfig, EvmWitnessParams } from '@xyo-network/witness-evm-abstract'

import { getErc1967SlotStatus } from './lib'
import { Erc1967Status, Erc1967StatusSchema } from './Payload'

export const Erc1967WitnessConfigSchema = 'network.xyo.erc1967.witness.config'
export type Erc1967WitnessConfigSchema = typeof Erc1967WitnessConfigSchema

export type Erc1967WitnessConfig = EvmWitnessConfig<{ address?: string }, Erc1967WitnessConfigSchema>

export type Erc1967WitnessParams = EvmWitnessParams<Erc1967WitnessConfig>

export class Erc1967Witness<TParams extends Erc1967WitnessParams = Erc1967WitnessParams> extends AbstractEvmWitness<
  TParams,
  EvmAddress,
  Erc1967Status
> {
  static override configSchemas = [Erc1967WitnessConfigSchema]

  protected override async observeHandler(inPayloads: EvmAddress[] = []): Promise<Erc1967Status[]> {
    await this.started('throw')
    //calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType<EvmAddress>(EvmAddressSchema)).map(async ({ address }) => {
          const validatedAddress = assertEx(address ?? this.config.address, 'Missing address').toLowerCase()

          const provider = await this.getProvider(true, true)

          const block = await provider.getBlockNumber()

          const { beacon, implementation, slots } = await getErc1967SlotStatus(provider, validatedAddress, block)

          const observation: Erc1967Status = {
            address: validatedAddress,
            beacon,
            block,
            chainId: Number((await provider.getNetwork()).chainId),
            implementation,
            schema: Erc1967StatusSchema,
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
