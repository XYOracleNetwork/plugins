import { Token } from "@uniswap/sdk-core";

export interface UniswapV4TokenContractIdentifier {
  tokenA: Token,
  tokenB: Token,
  fee: number,
  hookAddress?: string,
}
