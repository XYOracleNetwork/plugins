import { assertEx } from '@xylabs/assert'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerConfig, DivinerParams } from '@xyo-network/diviner-model'
import { EvmContract, isEvmContract } from '@xyo-network/evm-contract-witness'
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
import { Interface, JsonFragment } from 'ethers'

import { EvmTokenInterfaceImplemented, EvmTokenInterfaceImplementedSchema, TokenInterface } from './Payload'

export const EvmTokenInterfaceImplementedDivinerConfigSchema = `${EvmTokenInterfaceImplementedSchema}.diviner.config`
export type EvmTokenInterfaceImplementedDivinerConfigSchema = typeof EvmTokenInterfaceImplementedDivinerConfigSchema

export type EvmTokenInterfaceImplementedDivinerConfig = DivinerConfig<{
  schema: EvmTokenInterfaceImplementedDivinerConfigSchema
  tokenInterfaces?: TokenInterface[]
}>

export type EvmTokenInterfaceImplementedDivinerParams = DivinerParams<AnyConfigSchema<EvmTokenInterfaceImplementedDivinerConfig>>

type DistributiveMappedType<T> = T extends string ? { [K in T]: readonly JsonFragment[] } : never
type TokenInterfaceDictionary = DistributiveMappedType<TokenInterface>

/**
 * A diviner that checks if a contract implements a token interface
 */
export class EvmTokenInterfaceImplementedDiviner<
  TParams extends EvmTokenInterfaceImplementedDivinerParams = EvmTokenInterfaceImplementedDivinerParams,
> extends AbstractDiviner<TParams, EvmContract, EvmTokenInterfaceImplemented> {
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
  static override configSchemas = [EvmTokenInterfaceImplementedDivinerConfigSchema]

  private _tokenInterfaces?: TokenInterfaceDictionary

  /**
   * The list of token interfaces to check against the contract
   */
  get tokenInterfaces() {
    if (!this._tokenInterfaces) {
      this._tokenInterfaces =
        this.config?.tokenInterfaces ?
          (Object.fromEntries(
            this.config?.tokenInterfaces.map((tokenInterface) => {
              return [tokenInterface, EvmTokenInterfaceImplementedDiviner.SupportedTokenInterfaces[tokenInterface]] as const
            }),
          ) as TokenInterfaceDictionary) ?? {}
        : EvmTokenInterfaceImplementedDiviner.SupportedTokenInterfaces
    }
    return this._tokenInterfaces
  }

  protected override async divineHandler(inPayloads: EvmContract[] = []): Promise<EvmTokenInterfaceImplemented[]> {
    await this.started('throw')
    try {
      const allResults = await Promise.all(
        // Iterate over each contract passed in
        inPayloads.filter(isEvmContract).map(({ address, code, chainId }) => {
          // Ensure we have the contract code
          const byteCode = assertEx(code, 'Missing code')
          const results: EvmTokenInterfaceImplemented[] = []
          // Iterate over each token interface
          for (const [tokenInterface, abi] of Object.entries(this.tokenInterfaces)) {
            // Check if the contract implements the interface abi
            const contractInterface = new Interface(abi)
            const implementations: boolean[] = []
            contractInterface.forEachFunction(({ selector }) => {
              implementations.push(byteCode.includes(BigInt(selector).toString(16)))
            })
            const implemented = implementations.every(Boolean)
            const result: EvmTokenInterfaceImplemented = {
              address,
              chainId,
              implemented,
              schema: EvmTokenInterfaceImplementedSchema,
              tokenInterface: tokenInterface as TokenInterface,
            }
            results.push(result)
          }

          return results
        }),
      )
      return allResults.flat()
    } catch (ex) {
      const error = ex as Error
      console.log(`Error [${this.config.name}]: ${error.message}`)
      throw error
    }
  }
}
