import { assertEx } from '@xylabs/assert'
import { AbstractDiviner } from '@xyo-network/abstract-diviner'
import { DivinerConfig, DivinerParams } from '@xyo-network/diviner-model'
import { EvmContract, EvmContractSchema } from '@xyo-network/evm-contract-witness'
import { AnyConfigSchema } from '@xyo-network/module-model'
import {
  ERC20__factory,
  ERC721__factory,
  ERC1155__factory,
  IERC721Enumerable__factory,
  IERC721Metadata__factory,
  IERC721Receiver__factory,
  IERC1155MetadataURI__factory,
  IERC1155Receiver__factory,
} from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { Interface, JsonFragment } from 'ethers'

import { EvmTokenInterfaceImplemented, EvmTokenInterfaceImplementedSchema, TokenInterface } from './Payload'

export const EvmTokenInterfaceDivinerConfigSchema = 'network.xyo.evm.token.interface.implemented.diviner.config'
export type EvmTokenInterfaceDivinerConfigSchema = typeof EvmTokenInterfaceDivinerConfigSchema

export type EvmTokenInterfaceDivinerConfig = DivinerConfig<{ schema: EvmTokenInterfaceDivinerConfigSchema; tokenInterfaces?: TokenInterface[] }>

export type EvmTokenInterfaceDivinerParams = DivinerParams<AnyConfigSchema<EvmTokenInterfaceDivinerConfig>>

type DistributiveMappedType<T> = T extends string ? { [K in T]: readonly JsonFragment[] } : never
type TokenInterfaceDictionary = DistributiveMappedType<TokenInterface>

export class EvmTokenInterfaceDiviner<TParams extends EvmTokenInterfaceDivinerParams = EvmTokenInterfaceDivinerParams> extends AbstractDiviner<
  TParams,
  EvmContract,
  EvmTokenInterfaceImplemented
> {
  /**
   * The list of supported token interfaces
   */
  static readonly SupportedTokenInterfaces: Readonly<Record<TokenInterface, readonly JsonFragment[]>> = {
    ERC1155: ERC1155__factory.abi,
    ERC1155Metadata_URI: IERC1155MetadataURI__factory.abi,
    ERC1155TokenReceiver: IERC1155Receiver__factory.abi,
    ERC20: ERC20__factory.abi,
    ERC721: ERC721__factory.abi,
    ERC721Enumerable: IERC721Enumerable__factory.abi,
    ERC721Metadata: IERC721Metadata__factory.abi,
    ERC721TokenReceiver: IERC721Receiver__factory.abi,
  }
  static override configSchemas = [EvmTokenInterfaceDivinerConfigSchema]

  private _tokenInterfaces?: TokenInterfaceDictionary

  get tokenInterfaces() {
    if (!this._tokenInterfaces) {
      if (this.config?.tokenInterfaces) {
        this._tokenInterfaces =
          (Object.fromEntries(
            this.config?.tokenInterfaces.map((tokenInterface) => {
              return [tokenInterface, EvmTokenInterfaceDiviner.SupportedTokenInterfaces[tokenInterface]] as const
            }),
          ) as TokenInterfaceDictionary) ?? {}
      } else {
        this._tokenInterfaces = EvmTokenInterfaceDiviner.SupportedTokenInterfaces
      }
    }
    return this._tokenInterfaces
  }

  protected override async divineHandler(inPayloads: EvmContract[] = []): Promise<EvmTokenInterfaceImplemented[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType<EvmContract>(EvmContractSchema)).map(({ address, code }) => {
          const byteCode = assertEx(code, 'Missing code')

          const results: EvmTokenInterfaceImplemented[] = []

          Object.entries(this.tokenInterfaces).forEach(([tokenInterface, abi]) => {
            const contractInterface = new Interface(abi)
            contractInterface.forEachFunction(({ selector }) => {
              const observation: EvmTokenInterfaceImplemented = {
                address,
                implemented: byteCode.includes(BigInt(selector).toString(16)),
                schema: EvmTokenInterfaceImplementedSchema,
                tokenInterface: tokenInterface as TokenInterface,
              }
              results.push(observation)
            })
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
