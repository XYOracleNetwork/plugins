import { assertEx } from '@xylabs/assert'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type { DivinerConfig, DivinerParams } from '@xyo-network/diviner-model'
import type { EvmContract } from '@xyo-network/evm-contract-witness'
import { EvmContractSchema } from '@xyo-network/evm-contract-witness'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { Interface } from 'ethers'

import type { EvmFunctionImplemented, InterfaceAbi } from './Payload.ts'
import { EvmFunctionImplementedSchema } from './Payload.ts'

export const EvmAbiImplementedDivinerConfigSchema = 'network.xyo.evm.abi.implemented.diviner.config'
export type EvmAbiImplementedDivinerConfigSchema = typeof EvmAbiImplementedDivinerConfigSchema

export type EvmAbiImplementedDivinerConfig = DivinerConfig<{ abi?: InterfaceAbi; schema: EvmAbiImplementedDivinerConfigSchema }>

export type EvmAbiImplementedDivinerParams = DivinerParams<AnyConfigSchema<EvmAbiImplementedDivinerConfig>>

export class EvmAbiImplementedDiviner<TParams extends EvmAbiImplementedDivinerParams = EvmAbiImplementedDivinerParams> extends AbstractDiviner<
  TParams,
  EvmContract,
  EvmFunctionImplemented
> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EvmAbiImplementedDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = EvmAbiImplementedDivinerConfigSchema

  get abi() {
    return assertEx(this.config?.abi, () => 'No ABI specified') as InterfaceAbi
  }

  protected override async divineHandler(inPayloads: EvmContract[] = []): Promise<EvmFunctionImplemented[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType<EvmContract>(EvmContractSchema)).map(({ address, code }) => {
          const contractInterface = new Interface(this.abi)
          const byteCode = assertEx(code, () => 'Missing code')

          const results: EvmFunctionImplemented[] = []

          contractInterface.forEachFunction(({ selector }) => {
            const observation: EvmFunctionImplemented = {
              address,
              implemented: byteCode.includes(BigInt(selector).toString(16)),
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
