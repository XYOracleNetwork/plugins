import { CryptoAsset } from '@xyo-network/coingecko-crypto-market-payload-plugin'

export const defaultCoins: CryptoAsset[] = [
  { name: 'bitcoin' },
  { name: 'binance-usd' },
  { name: 'bnb' },
  { name: 'cardano' },
  { name: 'dogecoin' },
  { name: 'ethereum' },
  { name: 'polkadot' },
  { name: 'solana' },
  { name: 'tether' },
  { name: 'usd-coin' },
  { name: 'wrapped-bitcoin' },
  { name: 'xrp' },
  { name: 'xyo-network' },
]

export const defaultCurrencies: CryptoAsset[] = [{ symbol: 'usd' }, { symbol: 'eur' }, { symbol: 'btc' }, { symbol: 'eth' }]
