import { assertEx } from '@xylabs/assert'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import {
  AbstractBlockchainWitness,
  BlockchainAddress,
  BlockchainAddressSchema,
  BlockchainWitnessConfig,
  BlockchainWitnessParams,
} from '@xyo-network/witness-blockchain-abstract'

import { getErc1822SlotStatus } from './lib'
import { Erc1822Status, Erc1822StatusSchema } from './Payload'

export const Erc1822WitnessConfigSchema = 'network.xyo.erc1822.witness.config'
export type Erc1822WitnessConfigSchema = typeof Erc1822WitnessConfigSchema

export type Erc1822WitnessConfig = BlockchainWitnessConfig<{ address?: string }, Erc1822WitnessConfigSchema>

export type Erc1822WitnessParams = BlockchainWitnessParams<Erc1822WitnessConfig>

export class Erc1822Witness<TParams extends Erc1822WitnessParams = Erc1822WitnessParams> extends AbstractBlockchainWitness<
  TParams,
  BlockchainAddress,
  Erc1822Status
> {
  static override configSchemas = [Erc1822WitnessConfigSchema]

  protected override async observeHandler(inPayloads: BlockchainAddress[] = []): Promise<Erc1822Status[]> {
    await this.started('throw')
    //calling it here to make sure we rests the cache
    await this.getProviders()
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(BlockchainAddressSchema)).map(async ({ address }) => {
          const validatedAddress = assertEx(address ?? this.config.address, 'Missing address')

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
