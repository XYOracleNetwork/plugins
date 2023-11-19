import { Interface, Provider } from 'ethers'

export const contractHasFunctions = async (provider: Provider, address: string, contractInterface: Interface, functionNames: string[]) => {
  try {
    const bytecode = await provider.getCode(address, 'latest')
    for (let i = 0; i < functionNames.length; i++) {
      const nameSig = contractInterface.getFunction(functionNames[i])?.selector
      if (!nameSig) {
        return false
      }
      if (!bytecode.includes(nameSig)) {
        return false
      }
      return true
    }
    return false
  } catch (ex) {
    const error = ex as Error
    console.log(error)
    return false
  }
}
