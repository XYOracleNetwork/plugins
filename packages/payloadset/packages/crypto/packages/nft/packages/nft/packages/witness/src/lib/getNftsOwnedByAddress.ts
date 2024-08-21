import { isHexZero } from '@xylabs/hex'
import type { NftInfoFields, TokenType } from '@xyo-network/crypto-nft-payload-plugin'
import { getErc1822SlotStatus } from '@xyo-network/erc1822-witness'
import { getErc1967SlotStatus } from '@xyo-network/erc1967-witness'
import { ERC721__factory, ERC1155__factory, ERC1155Supply__factory } from '@xyo-network/open-zeppelin-typechain'
import type { Provider } from 'ethers'
import { LRUCache } from 'lru-cache'

import { getNftMetadata } from './getNftMetadata.ts'
import { getNftsFromWalletFromOpenSea } from './getNftsFromWalletFromOpenSea.ts'
import { getProvider } from './getProvider.ts'
import { tokenTypes } from './tokenTypes.ts'
import { tryCall } from './tryCall.ts'

const tokenTypeCache = new LRUCache<string, TokenType[]>({ max: 100 })

export const getTokenTypes = async (provider: Provider, address: string) => {
  const key = `${address}|${(await provider.getNetwork()).chainId}`
  const currentValue = tokenTypeCache.get(key)
  if (currentValue) {
    return currentValue
  } else {
    const types = await tokenTypes(provider, address)
    tokenTypeCache.set(key, types)
    return types
  }
}

export const getErc721MetadataUri = async (
  address: string,
  tokenId: string,
  provider: Provider,
): Promise<[string | undefined, Error | undefined]> => {
  try {
    const contract = ERC721__factory.connect(address, provider)
    return [await contract.tokenURI(tokenId), undefined]
  } catch (ex) {
    return [undefined, ex as Error]
  }
}

export const getErc1155MetadataUri = async (
  address: string,
  tokenId: string,
  provider: Provider,
): Promise<[string | undefined, Error | undefined]> => {
  try {
    const contract = ERC1155__factory.connect(address, provider)
    return [await contract.uri(tokenId), undefined]
  } catch (ex) {
    return [undefined, ex as Error]
  }
}

export const getNftMetadataUri = async (address: string, tokenId: string, provider: Provider) => {
  const results = await Promise.all([getErc721MetadataUri(address, tokenId, provider), getErc1155MetadataUri(address, tokenId, provider)])
  return results[0][0] ?? results[1][0]
}

export const getNftsOwnedByAddressWithMetadata = async (
  /** @param publicAddress The address of the wallet to search for NFTs */
  publicAddress: string,
  /** @param provider The provider to use for accessing the block chain */
  providers: Provider[],
  /** @param maxNfts The maximum number of NFTs to return. Configurable to prevent large wallets from exhausting Infura API credits. */
  maxNfts = 200,
  /** @param httpTimeout The connection timeout for http call to get metadata */
  timeout = 5000,
): Promise<NftInfoFields[]> => {
  const nfts = await getNftsOwnedByAddress(publicAddress, providers, maxNfts, timeout)
  const nftResult = await Promise.all(
    nfts.map(async (nft) => {
      try {
        if (!nft.metadataUri || !nft.metadata) {
          const [metadataUri, metadata] = await getNftMetadata(
            nft.implementation ?? nft.address,
            getProvider(providers),
            nft.tokenId,
            true,
            nft.metadataUri,
          )
          nft.metadata = nft.metadata ?? metadata
          nft.metadataUri = nft.metadataUri ?? metadataUri
        }
        return nft
      } catch (ex) {
        const error = ex as Error
        console.error(`Error: ${error.message}`)
        console.error(`${error.stack}`)
        throw ex
      }
    }),
  )
  return nftResult
}

export const getNftsOwnedByAddress = async (
  /** @param publicAddress The address of the wallet to search for NFTs */
  publicAddress: string,
  /** @param provider The provider to use for accessing the block chain */
  providers: Provider[],
  /** @param maxNfts The maximum number of NFTs to return. Configurable to prevent large wallets from exhausting Infura API credits. */
  maxNfts = 100,
  /** @param httpTimeout The connection timeout for http call to get metadata */
  timeout = 5000,
): Promise<NftInfoFields[]> => {
  // const assets = await getAssetsFromWallet(publicAddress, maxNfts, timeout)
  const nfts = await getNftsFromWalletFromOpenSea(publicAddress, maxNfts, timeout)

  const nftResult = await Promise.all(
    nfts.map(async (nft) => {
      try {
        const { contract, identifier, metadata_url } = nft
        const provider = getProvider(providers)

        const block = await provider.getBlockNumber()

        // Check if Upgradeable
        const [erc1967Status, erc1822Status] = await Promise.all([
          // Check if ERC-1967 Upgradeable
          getErc1967SlotStatus(provider, contract, block),

          // Check if ERC-1822 Upgradeable
          getErc1822SlotStatus(provider, contract, block),
        ])

        const implementation
          = !erc1967Status.slots.implementation || isHexZero(erc1967Status.slots.implementation)
            ? erc1822Status.implementation
            : erc1967Status.implementation

        let supply = 1n
        const types = await getTokenTypes(provider, implementation)
        if (types.includes('ERC1155')) {
          const supply1155 = ERC1155Supply__factory.connect(implementation, getProvider(providers))
          supply = (await tryCall(async () => await supply1155['totalSupply(uint256)'](erc1967Status.address))) ?? 1n
        }
        const fields: NftInfoFields = {
          address: contract,
          chainId: Number((await provider.getNetwork()).chainId),
          metadataUri: metadata_url ?? undefined,
          supply: `0x${supply.toString(16)}`,
          tokenId: identifier,
          type: types.at(0),
          types,
        }
        if (implementation !== contract) {
          fields.implementation = implementation
        }
        return fields
      } catch (ex) {
        const error = ex as Error
        console.error(`Error: ${error.message}`)
        console.error(`${error.stack}`)
        throw ex
      }
    }),
  )

  return nftResult
}
