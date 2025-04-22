import { Token } from "@uniswap/sdk-core"
import { AbiCoder } from "ethers/abi"
import { ZeroAddress } from "ethers/constants"
import { keccak256 } from "ethers/crypto"

export const getPoolId = (
  currencyA: Token,
  currencyB: Token,
  fee: number,
  tickSpacing: number,
  hooks: string
): string =>{
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