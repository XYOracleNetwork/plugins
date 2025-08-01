import { assertEx } from '@xylabs/assert'
import { EthAddressWrapper } from '@xylabs/eth-address'
import type {
  CryptoWalletNftWitnessConfig,
  NftInfo,
  NftWitnessQuery,
} from '@xyo-network/crypto-nft-payload-plugin'
import {
  isNftWitnessQuery,
  NftSchema,
  NftWitnessConfigSchema,
} from '@xyo-network/crypto-nft-payload-plugin'
import type { Schema } from '@xyo-network/payload-model'
import type { EvmWitnessParams } from '@xyo-network/witness-evm-abstract'
import { AbstractEvmWitness } from '@xyo-network/witness-evm-abstract'

import { getNftsOwnedByAddress, getNftsOwnedByAddressWithMetadata } from './lib/index.ts'

export type CryptoWalletNftWitnessParams = EvmWitnessParams<CryptoWalletNftWitnessConfig>

const schema = NftSchema

const defaultMaxNfts = 200

export class CryptoWalletNftWitness<TParams extends CryptoWalletNftWitnessParams = CryptoWalletNftWitnessParams> extends AbstractEvmWitness<
  TParams,
  NftWitnessQuery,
  NftInfo
> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, NftWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = NftWitnessConfigSchema

  get loadMetadata() {
    return this.config.loadMetadata ?? true
  }

  get timeout() {
    return this.config.timeout ?? 10_000
  }

  protected override async observeHandler(payloads?: NftWitnessQuery[]): Promise<NftInfo[]> {
    await this.started('throw')
    const queries = payloads?.filter(isNftWitnessQuery) ?? []
    // calling it here to make sure we rests the cache
    const providers = await this.getProviders()
    try {
      const observations = await Promise.all(
        queries.map(async (query) => {
          const provider = await this.getProvider(true, true)
          const addressValue = assertEx(query?.address ?? this.config.address, () => 'params.address is required')
          const parsedAddressValue = EthAddressWrapper.parse(addressValue)
          const address = assertEx(parsedAddressValue?.toString(), () => 'Failed to parse params.address')
          const network = await provider.getNetwork()
          const chainId = assertEx(network.chainId, () => 'params.chainId is required')
          const maxNfts = query?.maxNfts || defaultMaxNfts
          try {
            const nfts
              = this.loadMetadata
                ? await getNftsOwnedByAddressWithMetadata(address, providers, maxNfts, this.timeout)
                : await getNftsOwnedByAddress(address, providers, maxNfts, this.timeout)
            const observation = nfts.map<NftInfo>((nft) => {
              return { ...nft, schema }
            })
            return observation
          } catch (ex) {
            const error = ex as Error
            throw new Error(`Failed to get nfts for address ${address} on chainId ${chainId}: ${error.message}`)
          }
        }),
      )
      return observations.flat()
    } catch (ex) {
      const error = ex as Error
      console.error(error)
      return []
    }
  }
}
