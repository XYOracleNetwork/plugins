import type { Promisable } from '@xylabs/sdk-js'
import { assertEx } from '@xylabs/sdk-js'
import type {
  ContractInfo,
  CryptoContractDivinerParams,
  CryptoContractFunctionCallResult,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import {
  asCryptoContractFunctionCallSuccess,
  ContractInfoSchema,
  CryptoContractDivinerConfigSchema,
  CryptoContractDivinerLabels,
  CryptoContractFunctionCallResultSchema,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type { Payload, Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

/** @deprecated use EvmCallDiviner instead */
export type FindCallResult<TResult = string, TPayload = Payload> = [TResult, TPayload] | [undefined, TPayload] | [undefined, undefined]

/** @deprecated use EvmCallDiviner instead */
export class CryptoContractDiviner<TParams extends CryptoContractDivinerParams = CryptoContractDivinerParams> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CryptoContractDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = CryptoContractDivinerConfigSchema
  static override readonly labels: CryptoContractDivinerLabels = { ...super.labels, ...CryptoContractDivinerLabels }

  protected static findCallResult<TResult = string>(
    address: string,
    functionName: string,
    payloads: CryptoContractFunctionCallResult[],
  ): TResult | undefined {
    const foundPayload = payloads.find(payload => payload.functionName === functionName && payload.address === address)
    return asCryptoContractFunctionCallSuccess(foundPayload)?.result as TResult | undefined
  }

  protected static matchingExistingField<R = string, T extends Payload = Payload>(objs: T[], field: keyof T): R | undefined {
    const expectedValue = objs.at(0)?.[field] as R
    // eslint-disable-next-line unicorn/no-array-reduce
    const didNotMatch = objs.reduce((prev, obj) => {
      return prev || obj[field] !== expectedValue
    }, false)
    return didNotMatch ? undefined : expectedValue
  }

  protected contractInfoRequiredFields(callResults: CryptoContractFunctionCallResult[]): ContractInfo {
    return {
      address: assertEx(CryptoContractDiviner.matchingExistingField(callResults, 'address'), () => 'Mismatched address'),
      chainId: assertEx(CryptoContractDiviner.matchingExistingField(callResults, 'chainId'), () => 'Mismatched chainId'),
      schema: ContractInfoSchema,
    }
  }

  protected override async divineHandler(inPayloads: CryptoContractFunctionCallResult[] = []): Promise<ContractInfo[]> {
    const callResults = inPayloads.filter(isPayloadOfSchemaType<CryptoContractFunctionCallResult>(CryptoContractFunctionCallResultSchema))
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
        const info: ContractInfo = {
          results: await this.reduceResults(foundCallResults),
          ...this.contractInfoRequiredFields(foundCallResults),
        }
        return info
      }),
    )

    return result
  }

  protected reduceResults(callResults: CryptoContractFunctionCallResult[]): Promisable<ContractInfo['results']> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return callResults.reduce<Record<string, unknown>>((prev, callResult) => {
      prev[callResult.functionName] = asCryptoContractFunctionCallSuccess(callResult)?.result
      return prev
    }, {})
  }
}
