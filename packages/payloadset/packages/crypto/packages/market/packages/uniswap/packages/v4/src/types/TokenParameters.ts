/**
 * Represents the minimal metadata required to define an ERC-20 token
 * in the context of Uniswap pool interactions, token registries, or
 * off-chain utilities.
 *
 * This structure is designed to be lightweight but expressive enough
 * to support pool ID generation, token sorting, and on-chain lookups.
 */
export type TokenParameters = {
  /**
   * The Ethereum address of the token contract.
   */
  address: string

  /**
   * The chain ID where this token is deployed.
   * This enables multi-chain compatibility and avoids collisions between
   * tokens with the same address on different networks (e.g. mainnet vs testnet).
   */
  chainId: number

  /**
   * The number of decimals used by the token.
   * This is required for correct price calculations and amount formatting.
   */
  decimals: number

  /**
   * A short uppercase identifier for the token (e.g. 'USDT', 'WETH').
   * Used for display, logging, and lookup convenience.
   */
  symbol: string

  /**
   * (Optional) The full human-readable name of the token (e.g. 'Tether USD').
   * Useful for UIs or token metadata enrichment.
   */
  name?: string
}
