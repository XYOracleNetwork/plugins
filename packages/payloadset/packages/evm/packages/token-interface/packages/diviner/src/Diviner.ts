import { assertEx } from '@xylabs/assert'
import { AbstractDiviner } from '@xyo-network/abstract-diviner'
import { DivinerConfig, DivinerParams } from '@xyo-network/diviner-model'
import { EvmContract, EvmContractSchema } from '@xyo-network/evm-contract-witness'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { Interface } from 'ethers'

import { EvmFunctionImplemented, EvmFunctionImplementedSchema, InterfaceAbi } from './Payload'

export const EvmTokenInterfaceDivinerConfigSchema = 'network.xyo.evm.token.interface.implemented.diviner.config'
export type EvmTokenInterfaceDivinerConfigSchema = typeof EvmTokenInterfaceDivinerConfigSchema

export type EvmTokenInterfaceDivinerConfig = DivinerConfig<{ abi?: InterfaceAbi; schema: EvmTokenInterfaceDivinerConfigSchema }>

export type EvmTokenInterfaceDivinerParams = DivinerParams<AnyConfigSchema<EvmTokenInterfaceDivinerConfig>>

export class EvmTokenInterfaceDiviner<TParams extends EvmTokenInterfaceDivinerParams = EvmTokenInterfaceDivinerParams> extends AbstractDiviner<
  TParams,
  EvmContract,
  EvmFunctionImplemented
> {
  static override configSchemas = [EvmTokenInterfaceDivinerConfigSchema]

  get abi() {
    return assertEx(this.config?.abi, 'No ABI specified')
  }

  protected override async divineHandler(inPayloads: EvmContract[] = []): Promise<EvmFunctionImplemented[]> {
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
