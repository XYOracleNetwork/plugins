/**
 * Calculates the price from the square root price in Q96 format.
 * @param sqrtPriceX96 The square root price in Q96 format.
 * @param decimalsA The number of decimals for the first token.
 * @param decimalsB The number of decimals for the second token.
 * @returns The price as a number.
 */
export const getPriceFromSqrtX96 = (sqrtPriceX96: bigint, decimalsA: number, decimalsB: number): number => {
  const Q96 = 2n ** 96n

  // Scale to avoid floating point math by using a 1e18 factor
  const numerator = sqrtPriceX96 * sqrtPriceX96 * 10n ** 18n
  const denominator = Q96 * Q96

  let price = numerator / denominator

  // Adjust for decimal differences
  const decimalAdjustment = decimalsB - decimalsA
  if (decimalAdjustment > 0) {
    price *= 10n ** BigInt(decimalAdjustment)
  } else if (decimalAdjustment < 0) {
    price /= 10n ** BigInt(-decimalAdjustment)
  }

  return Number(price) / 1e18
}
