import { assertEx, axiosJsonConfig } from '@xylabs/sdk-js'
import { Axios } from 'axios'

interface QuickNodeAsset {
  chain: string
  collectionAddress: string
  collectionName: string
  collectionTokenId: string
  description: string
  imageUrl: string
  name: string
  network: string
}

interface QuickNodeFetchNftsResult {
  assets: QuickNodeAsset[]
  id: number
  jsonrpc: string
  owner: string
  pageNumber: number
  totalItems: number
  totalPages: number
}

export const getAssetsFromWallet = async (address: string, maxNfts = 10, timeout = 2000) => {
  const endpoint = assertEx(process.env.QUICKNODE_API_URI, () => 'No endpoint found')

  const axios = new Axios(axiosJsonConfig({ timeout }))

  const assets: QuickNodeAsset[] = []
  let done = false
  let currentPage = 0

  const id = Date.now()

  while (!done && assets.length < maxNfts) {
    const query = {
      id,
      jsonrpc: '2.0',
      method: 'qn_fetchNFTs',
      params: [
        {
          omitFields: ['traits'],
          page: currentPage + 1,
          perPage: 10,
          wallet: address,
        },
      ],
    }
    const results = (await axios.post<{ result: QuickNodeFetchNftsResult }>(endpoint, query)).data.result
    assets.push(...(results.assets ?? []))
    currentPage = results.pageNumber
    done = results.pageNumber === results.totalPages
  }
  return assets
}
