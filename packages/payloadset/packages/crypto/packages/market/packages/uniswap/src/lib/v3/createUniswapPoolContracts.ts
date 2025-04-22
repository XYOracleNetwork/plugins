import type { Provider } from 'ethers'

import { logErrors } from '../logErrors.ts'
import { EthersUniSwap3Pair } from './UniSwap3Pair.ts'

export const createUniswapPoolContracts = (provider: Provider, contracts: string[]) => {
  return logErrors(() => {
    return contracts.map(contract => new EthersUniSwap3Pair(contract, provider))
  })
}
