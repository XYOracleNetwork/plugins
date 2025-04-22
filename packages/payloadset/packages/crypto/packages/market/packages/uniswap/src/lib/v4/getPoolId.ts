import { Token } from "@uniswap/sdk-core"
import { AbiCoder } from "ethers/abi"
import { ZeroAddress } from "ethers/constants"
import { keccak256 } from "ethers/crypto"

/**
 * Computes the pool address for a given pair of tokens, fee, tick spacing, and hooks which
 * is used to identify the pool on the Uniswap V4 protocol.
 * @param currencyA - The first token in the pair.
 * @param currencyB - The second token in the pair.
 * @param fee - The fee tier for the pool.
 * @param tickSpacing - The tick spacing for the pool.
 * @param hooks - The hooks associated with the pool.
 * @returns The computed pool address as a string.
 */
export const getPoolId = (currencyA: Token, currencyB: Token, fee: number, tickSpacing: number, hooks: string): string => {
  const [currency0, currency1] = currencyA.sortsBefore(currencyB) ? [currencyA, currencyB] : [currencyB, currencyA]
  const currency0Addr = currency0.isNative ? ZeroAddress : currency0.wrapped.address
  const currency1Addr = currency1.isNative ? ZeroAddress : currency1.wrapped.address
  return keccak256(
      AbiCoder.defaultAbiCoder().encode(
        ['address', 'address', 'uint24', 'int24', 'address'],
        [currency0Addr, currency1Addr, fee, tickSpacing, hooks]
      ),
  )
}