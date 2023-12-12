import { assertEx } from '@xylabs/assert'
import { EvmContract, EvmContractSchema } from '@xyo-network/evm-contract-witness'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { AbstractBlockchainWitness, BlockchainWitnessConfig, BlockchainWitnessParams } from '@xyo-network/witness-blockchain-abstract'
import { Interface } from 'ethers'

import { EvmFunctionImplemented, EvmFunctionImplementedSchema, InterfaceAbi } from './Payload'

export const EvmAbiImplementedWitnessConfigSchema = 'network.xyo.evm.abi.implemented.witness.config'
export type EvmAbiImplementedWitnessConfigSchema = typeof EvmAbiImplementedWitnessConfigSchema

export type EvmAbiImplementedWitnessConfig = BlockchainWitnessConfig<{ abi?: InterfaceAbi }, EvmAbiImplementedWitnessConfigSchema>

export type EvmAbiImplementedWitnessParams = BlockchainWitnessParams<EvmAbiImplementedWitnessConfig>

export class EvmAbiImplementedWitness<
  TParams extends EvmAbiImplementedWitnessParams = EvmAbiImplementedWitnessParams,
> extends AbstractBlockchainWitness<TParams, EvmContract, EvmFunctionImplemented> {
  static override configSchemas = [EvmAbiImplementedWitnessConfigSchema]

  get abi() {
    return assertEx(this.config?.abi, 'No ABI specified')
  }

  protected override async observeHandler(inPayloads: EvmContract[] = []): Promise<EvmFunctionImplemented[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType<EvmContract>(EvmContractSchema)).map(({ address, code }) => {
          const contractInterface = new Interface(this.abi)
          const byteCode = assertEx(code, 'Missing code')

          const results: EvmFunctionImplemented[] = []

          contractInterface.forEachFunction(({ selector }) => {
            const observation: EvmFunctionImplemented = {
              address,
              implemented: byteCode.includes(selector.substring(2)),
              schema: EvmFunctionImplementedSchema,
              selector,
            }
            results.push(observation)
          })

          return results
        }),
      )
      return observations.flat()
    } catch (ex) {
      const error = ex as Error
      console.log(`Error [${this.config.name}]: ${error.message}`)
      throw error
    }
  }
}
