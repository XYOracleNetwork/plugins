import { assertEx } from '@xylabs/assert'
import type { Promisable } from '@xylabs/promise'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type { DivinerConfig, DivinerParams } from '@xyo-network/diviner-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { EvmCallDivinerLabels } from './Labels.ts'
import type { EvmCallResult } from './Payload.ts'
import { asEvmCallSuccess, EvmCallResultSchema } from './Payload.ts'

export type FindCallResult<TResult = string, TPayload = Payload> = [TResult, TPayload] | [undefined, TPayload] | [undefined, undefined]

export const EvmCallDivinerConfigSchema = 'network.xyo.evm.call.diviner.config'
export type EvmCallDivinerConfigSchema = typeof EvmCallDivinerConfigSchema

export type EvmCallDivinerConfig = DivinerConfig<{
  schema: EvmCallDivinerConfigSchema
}>
export type EvmCallDivinerParams = DivinerParams<EvmCallDivinerConfig>

export const EvmCallResultsSchema = 'network.xyo.evm.call.results'
export type EvmCallResultsSchema = typeof EvmCallResultsSchema

export type EvmCallResults = Payload<
  {
    address: string
    chainId: number
    results?: Record<
      string,
      {
        args?: unknown[]
        result: unknown
      }
    >
  },
  EvmCallResultsSchema
>

export class EvmCallDiviner<TParams extends EvmCallDivinerParams = EvmCallDivinerParams> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EvmCallDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = EvmCallDivinerConfigSchema
  static override labels: EvmCallDivinerLabels = { ...super.labels, ...EvmCallDivinerLabels }

  protected static findCallResult<TResult = string>(address: string, functionName: string, payloads: EvmCallResult[]): TResult | undefined {
    const foundPayload = payloads.find(payload => payload.functionName === functionName && payload.address === address)
    return asEvmCallSuccess(foundPayload)?.result as TResult | undefined
  }

  protected static matchingExistingField<R = string, T extends Payload = Payload>(objs: T[], field: keyof T): R | undefined {
    const expectedValue = objs.at(0)?.[field] as R
    // eslint-disable-next-line unicorn/no-array-reduce
    const didNotMatch = objs.reduce((prev, obj) => {
      return prev || obj[field] !== expectedValue
    }, false)
    return didNotMatch ? undefined : expectedValue
  }

  protected contractInfoRequiredFields(callResults: EvmCallResult[]): EvmCallResults {
    return {
      address: assertEx(EvmCallDiviner.matchingExistingField(callResults, 'address'), () => 'Mismatched address'),
      chainId: assertEx(EvmCallDiviner.matchingExistingField(callResults, 'chainId'), () => 'Mismatched chainId'),
      schema: EvmCallResultsSchema,
    }
  }

  protected override async divineHandler(inPayloads: EvmCallResult[] = []): Promise<EvmCallResults[]> {
    const callResults = inPayloads.filter(isPayloadOfSchemaType<EvmCallResult>(EvmCallResultSchema))
    const addresses = Object.keys(
      // eslint-disable-next-line unicorn/no-array-reduce
      callResults.reduce<Record<string, boolean>>((prev, result) => {
        if (result.address) {
          prev[result.address] = true
        }
        return prev
      }, {}),
    )
    const result = await Promise.all(
      addresses.map(async (address) => {
        const foundCallResults = callResults.filter(callResult => callResult.address === address)
        const results: EvmCallResults = {
          results: await this.reduceResults(foundCallResults),
          ...this.contractInfoRequiredFields(foundCallResults),
        }
        return results
      }),
    )

    return result
  }

  protected reduceResults(callResults: EvmCallResult[]): Promisable<EvmCallResults['results']> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return callResults.reduce<
      Record<
        string,
        {
          args?: unknown[]
          result: unknown
        }
      >
    >((prev, callResult) => {
      const typedCallResult = asEvmCallSuccess(callResult)
      if (typedCallResult) {
        prev[callResult.functionName] = { args: typedCallResult.args, result: typedCallResult?.result }
      }
      return prev
    }, {})
  }
}
