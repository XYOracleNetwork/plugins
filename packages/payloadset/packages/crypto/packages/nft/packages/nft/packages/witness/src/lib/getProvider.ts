import { Provider } from 'ethers'

export const getProvider = (providers: Provider[]) => {
  return providers[Date.now() % providers.length] //pick a random provider
}
