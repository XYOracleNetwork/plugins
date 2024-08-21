import type { Transaction } from '@xyo-network/crypto-address-transaction-history-payload-plugin'
import type { EtherscanProvider } from 'ethers'

/** @deprecated - no longer supported by EtherScan */
export const getTransactionsForAddress = async (
  /**
   * The address of the wallet to search for NFTs
   */
  _publicAddress: string,
  /**
   * The ethers provider to use to search
   */
  _provider: EtherscanProvider,
): Promise<Transaction[]> => {
  return await Promise.resolve([])
}
