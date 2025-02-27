import { assertEx } from '@xylabs/assert'
import { Interface, Provider } from 'ethers'

export const contractHasFunctions = async (provider: Provider, address: string, contractInterface: Interface, functionNames: string[]) => {
  try {
    const bytecode = await provider.getCode(address, 'latest')
    for (const functionName of functionNames) {
      const selector = assertEx(contractInterface.getFunction(functionName)?.selector, () => 'Function not found on interface')
      return bytecode.includes(selector.slice(2))
    }
    return false
  } catch (ex) {
    const error = ex as Error
    console.log(error)
    return false
  }
}
