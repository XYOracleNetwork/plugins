import { Token } from "@uniswap/sdk-core"
import { ZeroAddress } from "ethers/constants"
import { Contract } from "ethers/contract"
import { Provider } from "ethers/providers"
import { getPoolId } from "./getPoolId.ts"
import { getPriceFromSqrtX96 } from "./getPriceFromSqrtX96.ts"

const STATE_VIEW_ADDRESS = "0x7ffe42c4a5deea5b0fec41c94c136cf115597227" // State view contract address

const STATE_VIEW_ABI = [{"inputs":[{"internalType":"contract IPoolManager","name":"_poolManager","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"}],"name":"getFeeGrowthGlobals","outputs":[{"internalType":"uint256","name":"feeGrowthGlobal0","type":"uint256"},{"internalType":"uint256","name":"feeGrowthGlobal1","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"}],"name":"getFeeGrowthInside","outputs":[{"internalType":"uint256","name":"feeGrowthInside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1X128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"}],"name":"getLiquidity","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"bytes32","name":"positionId","type":"bytes32"}],"name":"getPositionInfo","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"bytes32","name":"salt","type":"bytes32"}],"name":"getPositionInfo","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"bytes32","name":"positionId","type":"bytes32"}],"name":"getPositionLiquidity","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"}],"name":"getSlot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint24","name":"protocolFee","type":"uint24"},{"internalType":"uint24","name":"lpFee","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int16","name":"tick","type":"int16"}],"name":"getTickBitmap","outputs":[{"internalType":"uint256","name":"tickBitmap","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tick","type":"int24"}],"name":"getTickFeeGrowthOutside","outputs":[{"internalType":"uint256","name":"feeGrowthOutside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthOutside1X128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tick","type":"int24"}],"name":"getTickInfo","outputs":[{"internalType":"uint128","name":"liquidityGross","type":"uint128"},{"internalType":"int128","name":"liquidityNet","type":"int128"},{"internalType":"uint256","name":"feeGrowthOutside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthOutside1X128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tick","type":"int24"}],"name":"getTickLiquidity","outputs":[{"internalType":"uint128","name":"liquidityGross","type":"uint128"},{"internalType":"int128","name":"liquidityNet","type":"int128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolManager","outputs":[{"internalType":"contract IPoolManager","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

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
  const stateView = new Contract(STATE_VIEW_ADDRESS, STATE_VIEW_ABI, provider)
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]

  const poolId: string = getPoolId(token0, token1, fee, 60, hooks)
  if (poolId === ZeroAddress) throw new Error("Invalid poolId")
  const response = await stateView.getSlot0(poolId)
  const sqrtPriceX96 = response[0]
  console.log("response", response)
  const price = getPriceFromSqrtX96(sqrtPriceX96, token1.decimals, token0.decimals)
  return price
}
