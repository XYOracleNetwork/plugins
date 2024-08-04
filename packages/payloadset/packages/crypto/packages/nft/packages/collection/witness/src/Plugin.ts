import { NftSchema } from '@xyo-network/crypto-nft-payload-plugin'
import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin, PayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

import { CryptoNftCollectionWitness } from './Witness.ts'

export const CryptoNftCollectionWitnessPlugin = (): PayloadSetWitnessPlugin<CryptoNftCollectionWitness> =>
  createPayloadSetWitnessPlugin<CryptoNftCollectionWitness>(
    { required: { [NftSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await CryptoNftCollectionWitness.create(params)
        return result
      },
    },
  )
