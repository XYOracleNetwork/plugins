import { TokenParameters } from "./TokenParameters.ts";

// NOTE: Would import this from @uniswap/v4-core, but
// they are currently hardcoded the ethers5 which
// causes issues
// export type PoolKey = {
//   currency0: string
//   currency1: string
//   fee: number
//   tickSpacing: number
//   hooks: string
// }

export type HydratedPoolKey = {
  fee: number,
  hookAddress: string,
  tickSpacing: number,
  tokens: [TokenParameters, TokenParameters],
}
