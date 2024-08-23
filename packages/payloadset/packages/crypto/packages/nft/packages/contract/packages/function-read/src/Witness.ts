import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type {
  CryptoContractFunctionCall,
  CryptoContractFunctionCallFailure,
  CryptoContractFunctionCallResult,
  CryptoContractFunctionCallSuccess,
  CryptoContractFunctionReadWitnessConfig,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import {
  CryptoContractFunctionCallResultSchema,
  CryptoContractFunctionCallSchema,
  CryptoContractFunctionReadWitnessConfigSchema,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import type { WitnessParams } from '@xyo-network/witness-model'
import type { Provider } from 'ethers'
import { Contract } from 'ethers'

/** @deprecated use EvmCallWitness instead */
export type CryptoContractFunctionReadWitnessParams = WitnessParams<
  AnyConfigSchema<CryptoContractFunctionReadWitnessConfig>,
  {
    providers: Provider[]
  }
>

/** @deprecated use EvmCallWitness instead */
export class CryptoContractFunctionReadWitness<
  TParams extends CryptoContractFunctionReadWitnessParams = CryptoContractFunctionReadWitnessParams,
> extends AbstractWitness<TParams, CryptoContractFunctionCall, CryptoContractFunctionCallResult> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CryptoContractFunctionReadWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = CryptoContractFunctionReadWitnessConfigSchema

  get abi() {
    return assertEx(this.config.abi, () => 'Missing abi')
  }

  protected override async observeHandler(inPayloads: CryptoContractFunctionCall[] = []): Promise<CryptoContractFunctionCallResult[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(CryptoContractFunctionCallSchema)).map(async ({
          functionName, args, address,
        }) => {
          const { providers } = this.params
          const provider = providers[Date.now() % providers.length] // pick a random provider
          const validatedAddress = assertEx(address ?? this.config.address, () => 'Missing address')
          const validatedFunctionName = assertEx(functionName ?? this.config.functionName, () => 'Missing address')
          const mergedArgs = [...(args ?? this.config.args ?? [])]

          const contract = new Contract(validatedAddress, this.abi, provider)
          try {
            const result = await contract[validatedFunctionName](...mergedArgs)
            const transformedResult = typeof result === 'bigint' ? result.toString(16) : result
            const observation: CryptoContractFunctionCallSuccess = {
              address: validatedAddress,
              args: mergedArgs,
              chainId: Number((await provider.getNetwork()).chainId),
              functionName: validatedFunctionName,
              result: transformedResult,
              schema: CryptoContractFunctionCallResultSchema,
            }
            return observation
          } catch (ex) {
            const error = ex as Error & { code: string }
            console.log(`Error [${this.config.name}]: ${error.code}`)
            const observation: CryptoContractFunctionCallFailure = {
              address: validatedAddress,
              args: mergedArgs,
              chainId: Number((await provider.getNetwork()).chainId),
              error: error.code,
              functionName: validatedFunctionName,
              schema: CryptoContractFunctionCallResultSchema,
            }
            return observation
          }
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
