import { AxiosJson } from '@xylabs/axios'
import { exists } from '@xylabs/exists'
import type { EthAddress } from '@xylabs/hex'
import { isHexZero } from '@xylabs/hex'
import type {
  NftInfo, NftMetadata, TokenType,
} from '@xyo-network/crypto-nft-payload-plugin'
import { NftSchema, toTokenType } from '@xyo-network/crypto-nft-payload-plugin'
import { getErc1822SlotStatus } from '@xyo-network/erc1822-witness'
import { getErc1967SlotStatus } from '@xyo-network/erc1967-witness'
import {
  ERC721Enumerable__factory, ERC721URIStorage__factory, ERC1155Supply__factory,
} from '@xyo-network/open-zeppelin-typechain'
import { checkIpfsUrl } from '@xyo-network/witness-blockchain-abstract'
import type { Provider } from 'ethers'

import { tokenTypes } from './tokenTypes.ts'
import { tryCall } from './tryCall.ts'

const ipfsGateway = '5d7b6582.beta.decentralnetworkservices.com'

function range(size: number, startAt: number = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map(i => i + startAt)
}

export const getNftCollectionNfts = async (
  /**
   * The address of the NFT contract to search for
   */
  contractAddress: EthAddress,
  /**
   * The chain ID (1 = Ethereum Mainnet, 4 = Rinkeby, etc.) of the chain to search for NFTs on
   */
  provider: Provider,
  types?: TokenType[],
  /**
   * The maximum number of NFTs to return. Configurable to prevent
   * large wallets from exhausting Infura API credits. Ideally a
   * multiple of 100 as that appears to be the default page size.
   */
  maxNfts = 100,
): Promise<NftInfo[]> => {
  try {
    const block = await provider.getBlockNumber()

    // Check if ERC-1967 Upgradeable
    const erc1967Status = await getErc1967SlotStatus(provider, contractAddress, block)

    // Check if ERC-1822 Upgradeable
    const erc1822Status = await getErc1822SlotStatus(provider, contractAddress, block)

    const implementation
      = !erc1967Status.slots.implementation || isHexZero(erc1967Status.slots.implementation)
        ? erc1822Status.implementation
        : erc1967Status.implementation

    const axios = new AxiosJson({ timeout: 2000 })
    const enumerable = ERC721Enumerable__factory.connect(implementation, provider)
    const storage = ERC721URIStorage__factory.connect(implementation, provider)
    const supply1155 = ERC1155Supply__factory.connect(implementation, provider)
    const finalTypes = types ?? (await tokenTypes(provider, implementation))

    const maxNftsArray = range(maxNfts)

    const result: NftInfo[] = (
      await Promise.all(
        maxNftsArray.map(async (_value, i) => {
          const tokenId = (await tryCall(async () => await enumerable.tokenByIndex(i, { blockTag: block }))) ?? BigInt(i)
          if (tokenId !== undefined) {
            const supply
              = finalTypes.includes(toTokenType('ERC1155'))
                ? ((await tryCall(async () => await supply1155['totalSupply(uint256)'](tokenId))) ?? '0x01')
                : '0x01'
            const metadataUri = await tryCall(async () => await storage.tokenURI(tokenId, { blockTag: block }))
            const checkedMetaDataUri = metadataUri ? checkIpfsUrl(metadataUri, ipfsGateway) : undefined
            let metadata: NftMetadata | undefined
            if (checkedMetaDataUri !== undefined) {
              try {
                metadata = (await axios.get(checkedMetaDataUri)).data
              } catch (ex) {
                const error = ex as Error
                console.error(`Get Metadata failed: ${error.message}`)
              }
            }

            const info: NftInfo = {
              address: contractAddress,
              chainId: Number((await provider.getNetwork()).chainId),
              metadata,
              metadataUri,
              schema: NftSchema,
              supply: `0x${supply.toString(16)}`,
              tokenId: `0x${tokenId.toString(16)}`,
              type: finalTypes.at(0),
              types: finalTypes,
            }
            if (implementation !== contractAddress) {
              info.implementation = implementation
            }
            return info
          }
        }),
      )
    ).filter(exists)
    return result
  } catch (ex) {
    const error = ex as Error
    console.error(`getNftCollectionNfts failed: [${error.name}] ${error.message}`)
    console.log(error.stack)
    return []
  }
}
