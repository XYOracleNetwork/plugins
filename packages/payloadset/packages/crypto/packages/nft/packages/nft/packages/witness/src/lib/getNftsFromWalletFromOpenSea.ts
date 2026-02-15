import type { EthAddress } from '@xylabs/sdk-js'
import { assertEx, axiosJsonConfig } from '@xylabs/sdk-js'
import { Axios } from 'axios'

interface OpenSeaNFT {
  /*
   * Collection slug. A unique string to identify a collection on OpenSea
   */
  collection: string
  /*
   * The unique public blockchain identifier for the contract
   */
  contract: EthAddress
  /**
   * @deprecated
   */
  created_at: string
  /*
   * Description of the NFT
   */
  description: string | null
  /*
   * The NFT's unique identifier within the smart contract (also referred to as token_id)
   */
  identifier: string
  /*
   * Link to the image associated with the NFT
   */
  image_url: string | null
  /*
   * If the item is currently able to be bought or sold using OpenSea
   */
  is_disabled: boolean
  /*
   * If the item is currently classified as 'Not Safe for Work' by OpenSea as defined in OpenSea's NSFW Policy.
   */
  is_nsfw: boolean
  /*
   * Link to the offchain metadata store
   */
  metadata_url: string | null
  /*
   * Name of the NFT
   */
  name: string | null
  /*
   * ERC standard of the token (erc721, erc1155)
   */
  token_standard: string
  /*
   * Last time that the NFT's metadata was updated by OpenSea
   */
  updated_at: string
}

export const getNftsFromWalletFromOpenSea = async (address: string, maxNfts = 200, timeout = 2000) => {
  const apiKey = assertEx(process.env.OPENSEA_API_KEY, () => 'No opensea key found')

  const axios = new Axios(axiosJsonConfig({ headers: { 'x-api-key': apiKey }, timeout }))

  const nfts = (await axios.get<{ nfts: OpenSeaNFT[] }>(`https://api.opensea.io/api/v2/chain/ethereum/account/${address}/nfts?limit=${maxNfts}`)).data
    .nfts
  return nfts
}
