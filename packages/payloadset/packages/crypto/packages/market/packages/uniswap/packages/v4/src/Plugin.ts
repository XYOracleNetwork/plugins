import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'
import { UniswapCryptoMarketSchema } from '@xyo-network/uniswap-crypto-market-payload-plugin'

import { UniswapV4CryptoMarketWitness } from './Witness.ts'

export const UniswapV4CryptoMarketPlugin = () =>
  createPayloadSetWitnessPlugin<UniswapV4CryptoMarketWitness>(
    { required: { [UniswapCryptoMarketSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await UniswapV4CryptoMarketWitness.create(params)
        return result
      },
    },
  )
