import { Provider } from 'ethers'

import { logErrors } from '../logErrors.js'
import { EthersUniSwap3Pair } from './UniSwap3Pair.js'

export const createUniswapPoolContracts = (provider: Provider, contracts: string[]) => {
  return logErrors(() => {
    return contracts.map((contract) => new EthersUniSwap3Pair(contract, provider))
  })
}
