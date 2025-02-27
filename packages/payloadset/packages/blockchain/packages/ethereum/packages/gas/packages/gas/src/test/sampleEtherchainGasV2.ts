import { EthereumGasEtherchainV2Payload, EthereumGasEtherchainV2Schema } from '@xyo-network/etherchain-gas-ethereum-blockchain-payload-plugins'

export const sampleEtherchainGasV2: EthereumGasEtherchainV2Payload = {
  code: 200,
  data: {
    fast: 19_803_047_330,
    priceUSD: 1195.77,
    rapid: 29_714_286_170,
    slow: 11_200_000_000,
    standard: 12_000_000_000,
    timestamp: 1_668_621_234_096,
  },
  schema: EthereumGasEtherchainV2Schema,
  timestamp: 1_668_621_240_790,
}
