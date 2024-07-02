import { NftSchema } from '@xyo-network/crypto-nft-payload-plugin'
import { PayloadSetSchema } from '@xyo-network/payload-model'
import { createPayloadSetWitnessPlugin } from '@xyo-network/payloadset-plugin'

// eslint-disable-next-line import/no-deprecated
import { CryptoContractFunctionReadWitness } from './Witness'

/** @deprecated use EvmCallWitness instead */
export const CryptoContractFunctionReadWitnessPlugin = () =>
  // eslint-disable-next-line deprecation/deprecation, import/no-deprecated
  createPayloadSetWitnessPlugin<CryptoContractFunctionReadWitness>(
    { required: { [NftSchema]: 1 }, schema: PayloadSetSchema },
    {
      witness: async (params) => {
        // eslint-disable-next-line deprecation/deprecation, import/no-deprecated
        const result = await CryptoContractFunctionReadWitness.create(params)
        return result
      },
    },
  )
