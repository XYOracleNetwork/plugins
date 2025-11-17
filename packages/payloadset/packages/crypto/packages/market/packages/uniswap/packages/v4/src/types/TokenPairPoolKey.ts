import type { TokenParameters } from './TokenParameters.ts'

// TODO: We could import this type from @uniswap/v4-core, but
// they are currently hardcoded the  ethers v5 which
// causes many issues since we are using ethers v6.  Moreover,
// we would have to hit the ERC20 contract to get the decimals
// and name of the token, which is not ideal as it never changes.
// export type PoolKey = {
//   currency0: string
//   currency1: string
//   fee: number
//   tickSpacing: number
//   hooks: string
// }

export type TokenPairPoolKey = {
  fee: number
  hookAddress: string
  tickSpacing: number
  tokens: [TokenParameters, TokenParameters]
}
