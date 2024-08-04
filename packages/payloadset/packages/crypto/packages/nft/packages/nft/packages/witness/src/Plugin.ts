import { NftSchema } from '@xyo-network/crypto-nft-payload-plugin'
import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin, PayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

import { CryptoWalletNftWitness } from './Witness.ts'

export const CryptoWalletNftWitnessPlugin = (): PayloadSetWitnessPlugin<CryptoWalletNftWitness> =>
  createPayloadSetWitnessPlugin<CryptoWalletNftWitness>(
    { required: { [NftSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await CryptoWalletNftWitness.create(params)
        return result
      },
    },
  )
