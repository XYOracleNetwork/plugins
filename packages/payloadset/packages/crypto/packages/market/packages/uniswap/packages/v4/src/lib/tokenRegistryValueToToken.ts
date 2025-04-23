import { Token } from '@uniswap/sdk-core'
import { getAddress } from 'ethers/address'

import type { TokenParameters } from '../types/index.ts'

export const tokenRegistryValueToToken = (value: TokenParameters): Token => {
  const {
    address, chainId, decimals, symbol, name,
  } = value
  const normalizedAddress = getAddress(address.toLowerCase())
  return new Token(chainId, normalizedAddress, decimals, symbol, name)
}
