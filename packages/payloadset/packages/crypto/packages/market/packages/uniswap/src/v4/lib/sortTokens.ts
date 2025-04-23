import { Token } from "@uniswap/sdk-core";

/**
 * Sorts two tokens in ascending order by address to ensure consistent ordering.
 *
 * In Uniswap v2, v3, and v4, pool addresses are deterministically derived using
 * `CREATE2` with a hash of the pool's initialization parameters. One critical
 * part of this hash is the `token0` and `token1` addresses. To ensure uniqueness
 * and prevent duplicate pools (e.g., USDC/WETH and WETH/USDC being treated as different),
 * Uniswap requires that token pairs be ordered **lexicographically by address**.
 *
 * This method ensures that tokens are sorted according to that rule.
 *
 * This is required any time you:
 * - Derive a pool address
 * - Generate a pool ID
 * - Call a function that expects a PoolKey or token pair in sorted order
 *
 * @param tokenA - The first token to compare
 * @param tokenB - The second token to compare
 * @returns A tuple `[token0, token1]` sorted by address in ascending order
 */
export const sortTokens = (tokenA: Token, tokenB: Token): [Token, Token] => {
  return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
}