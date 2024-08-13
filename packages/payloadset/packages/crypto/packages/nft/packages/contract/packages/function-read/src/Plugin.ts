import { NftSchema } from '@xyo-network/crypto-nft-payload-plugin'
import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

// eslint-disable-next-line import-x/no-deprecated
import { CryptoContractFunctionReadWitness } from './Witness.ts'

/** @deprecated use EvmCallWitness instead */
export const CryptoContractFunctionReadWitnessPlugin = () =>

  createPayloadSetWitnessPlugin<CryptoContractFunctionReadWitness>(
    { required: { [NftSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        const result = await CryptoContractFunctionReadWitness.create(params)
        return result
      },
    },
  )
