import { TokenType } from '@xyo-network/crypto-nft-payload-plugin'
import { ERC721__factory, ERC1155URIStorage__factory } from '@xyo-network/open-zeppelin-typechain'
import { Provider } from 'ethers'

import { contractHasFunctions } from './contractHasFunctions.js'

export const isErc1155 = async (provider: Provider, address: string) => {
  return await contractHasFunctions(provider, address, ERC1155URIStorage__factory.createInterface(), ['uri'])
}

export const isErc721 = async (provider: Provider, address: string) => {
  return await contractHasFunctions(provider, address, ERC721__factory.createInterface(), ['name', 'symbol', 'tokenURI'])
}

export const tokenTypes = async (provider: Provider, address: string) => {
  const [erc721, erc1155] = await Promise.all([isErc721(provider, address), isErc1155(provider, address)])
  const result: TokenType[] = []
  if (erc721) {
    result.push('ERC721')
  }
  if (erc1155) {
    result.push('ERC1155')
  }
  return result
}
