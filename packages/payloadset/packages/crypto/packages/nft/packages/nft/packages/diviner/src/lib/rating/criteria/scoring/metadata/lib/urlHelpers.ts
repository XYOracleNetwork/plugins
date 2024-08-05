export const web3Protocols = ['ipfs:', 'ar:']

export const toUrl = (url?: string | null): URL | undefined => {
  if (!url) return undefined
  try {
    return new URL(url)
  } catch {
    return undefined
  }
}

export const isValidUrl = (url?: string | null): boolean => toUrl(url) !== undefined
// eslint-disable-next-line unicorn/prefer-includes
export const isWeb3 = (url?: string | null): boolean => web3Protocols.some(protocol => protocol === toUrl(url)?.protocol)
export const isWeb2 = (url?: string | null): boolean => !isWeb3(url)
export const isSecure = (url?: string | null): boolean => isWeb3(url) || toUrl(url)?.protocol === 'https:'
