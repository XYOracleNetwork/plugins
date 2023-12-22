import { CoingeckoCryptoMarketPayload, CoingeckoCryptoMarketSchema } from '@xyo-network/coingecko-crypto-market-payload-plugin'

export const sampleCoinGeckoPayload: CoingeckoCryptoMarketPayload = {
  assets: {
    ada: {
      btc: 0.000_021_63,
      eth: 0.000_304_72,
      eur: 0.488_106,
      usd: 0.495_442,
    },
    btc: {
      btc: 1,
      eth: 14.068_021,
      eur: 22_545,
      usd: 22_884,
    },
    busd: {
      btc: 0.000_043_42,
      eth: 0.000_611_45,
      eur: 0.979_882,
      usd: 0.994_609,
    },
    doge: {
      btc: 0.000_002_88,
      eth: 0.000_040_62,
      eur: 0.065_066,
      usd: 0.066_044,
    },
    dot: {
      btc: 0.000_330_67,
      eth: 0.004_657_02,
      eur: 7.46,
      usd: 7.58,
    },
    eth: {
      btc: 0.070_992_16,
      eth: 1,
      eur: 1602.25,
      usd: 1626.33,
    },
    sol: {
      btc: 0.001_734_17,
      eth: 0.024_423_15,
      eur: 39.14,
      usd: 39.73,
    },
    usdc: {
      btc: 0.000_043_71,
      eth: 0.000_615_56,
      eur: 0.986_471,
      usd: 1.001,
    },
    usdt: {
      btc: 0.000_043_7,
      eth: 0.000_615_48,
      eur: 0.986_332,
      usd: 1.001,
    },
    wbtc: {
      btc: 1.000_635,
      eth: 14.092_397,
      eur: 22_584,
      usd: 22_923,
    },
    xyo: {
      btc: 6.282_82e-7,
      eth: 0.000_008_85,
      eur: 0.014_179_95,
      usd: 0.014_393_07,
    },
  },
  schema: CoingeckoCryptoMarketSchema,
  timestamp: 1_659_012_060_785,
}
