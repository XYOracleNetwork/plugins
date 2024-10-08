/* eslint-disable @typescript-eslint/member-ordering */
import type { FeePerGas } from './FeePerGas.ts'
import type { PriorityFeePerGas } from './PriorityFeePerGas.ts'

export interface FeeData {
  /**
   * The block number associated with the result
   */
  blockNumber?: string

  // EIP-1559
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md
  /**
   * There is a base fee per gas in protocol, which can move up or
   * down each block according to a formula which is a function of
   * gas used in parent block and gas target (block gas limit divided
   * by elasticity multiplier) of parent block. The algorithm results
   * in the base fee per gas increasing when blocks are above the gas
   * target, and decreasing when blocks are below the gas target. The
   * base fee per gas is burned.
   */
  baseFee?: number
  /**
   * Transactions also specify the maximum fee per gas they are
   * willing to pay total (aka: max fee), which covers both the
   * priority fee and the block's network fee per gas (aka: base fee)
   */
  feePerGas: Partial<FeePerGas>
  /**
   * Transactions specify the maximum fee per gas they are willing to
   * give to miners to incentivize them to include their transaction
   * (aka: priority fee).
   */
  priorityFeePerGas: Partial<PriorityFeePerGas>

  // Legacy
  gasPrice?: string

  // The timestamp associated with the result
  timestamp?: number
}
