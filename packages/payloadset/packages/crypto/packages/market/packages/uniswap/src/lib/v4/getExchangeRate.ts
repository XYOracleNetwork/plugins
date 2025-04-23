import { Token } from "@uniswap/sdk-core"
import { ZeroAddress } from "ethers/constants"
import { Provider } from "ethers/providers"
import { getPoolId } from "./getPoolId.ts"
import { getPriceFromSqrtX96 } from "./getPriceFromSqrtX96.ts"
import { IStateView__factory } from "@xyo-network/uniswap-typechain/v4-periphery"

const STATE_VIEW_ADDRESS = "0x7ffe42c4a5deea5b0fec41c94c136cf115597227" // State view contract address

/**
 * Returns the price of the token pair in the Uniswap V4 pool.
 * @param tokenA The first token in the pair.
 * @param tokenB The second token in the pair.
 * @param fee The fee tier for the pool.
 * @param hookAddress The address of the hook contract. Default is ZeroAddress.
 * @param provider The EVM provider to use for the transaction.
 * @returns The price of the token pair.
 */
export const getExchangeRate = async (
  tokenA: Token,
  tokenB: Token,
  fee: number,
  hookAddress: string | undefined, 
  provider: Provider
): Promise<number> => {
  const hooks = hookAddress || ZeroAddress
  const stateView = IStateView__factory.connect(STATE_VIEW_ADDRESS, provider)
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
  const poolId: string = getPoolId(token0, token1, fee, 60, hooks)
  if (poolId === ZeroAddress) throw new Error("Invalid poolId")
  const response = await stateView.getSlot0(poolId)
  const price = getPriceFromSqrtX96(response.sqrtPriceX96, token1.decimals, token0.decimals)
  return price
}
