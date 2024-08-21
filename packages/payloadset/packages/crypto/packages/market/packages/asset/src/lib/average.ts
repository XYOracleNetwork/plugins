import { exists } from '@xylabs/exists'
import type { AssetInfo, CryptoMarketAssetPayload, Currency, Token } from '@xyo-network/crypto-asset-payload-plugin'

const isNumber = (val: number | undefined): val is number => {
  return val !== undefined
}

const parseStringifiedNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const averageStringifiedNumbers = (...prices: (string | undefined)[]): number | undefined => {
  const numbers = prices.map(parseStringifiedNumber).filter(isNumber)
  return numbers.length > 0 ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : undefined
}

export const average = (...input: (CryptoMarketAssetPayload | undefined)[]): Record<string, AssetInfo> => {
  // Get all the assets represented
  const payloads = input.filter(exists)
  const tokens = new Set<Token>(payloads.flatMap(payload => Object.keys(payload.assets).map<Token>(t => t as Token)))
  // Get all the valuations used
  const valuations = new Set<Token | Currency>(
    [...tokens].flatMap((asset) => {
      const assetInfo = payloads.map(p => p.assets?.[asset]).filter(exists)
      const valueBasis = new Set<Currency | Token>(assetInfo.flatMap(v => Object.keys(v.value) as unknown as Currency | Token).filter(exists))
      return [...valueBasis]
    }),
  )
  // For each of the tokens, calculate the average valuation for each of valuation bases
  const assets: Record<string, AssetInfo> = Object.fromEntries(
    [...tokens].map((token) => {
      const assetInfo = payloads.map(p => p.assets?.[token]).filter(exists)
      const value = Object.fromEntries(
        [...valuations].map((valuation) => {
          const assetValuations = assetInfo.map(info => info.value?.[valuation])
          const averageAssetValuation = averageStringifiedNumbers(...assetValuations)
          return [valuation, averageAssetValuation?.toString()]
        }),
      )
      return [token, { value }]
    }),
  )
  return assets
}
