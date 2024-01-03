// eslint-disable-next-line workspaces/no-absolute-imports
import { EvmCallResults, EvmCallResultsSchema } from '@xyo-network/evm-call-witness'
import { isNftMetadataUri, NftMetadataUriSchema } from '@xyo-network/evm-nft-id-payload-plugin'
import { Payload } from '@xyo-network/payload-model'

import { EvmCallResultToNftTokenUriDiviner, EvmCallResultToNftTokenUriDivinerConfigSchema } from '../Diviner'

const validateResult = (evmCallResults: EvmCallResults, observation: Payload[]) => {
  const results = observation.filter(isNftMetadataUri)
  expect(results.length).toBe(1)
  expect(results[0].address).toBe(evmCallResults.address)
  expect(results[0].chainId).toBe(evmCallResults.chainId)
  // expect(results[0].tokenId).toBe(evmCallResults.results.tokenURI.args[0])
  expect(results[0].schema).toBe(NftMetadataUriSchema)
  expect(results[0].metadataUri).toBeString()
  // const num = Number(BigInt(tokenId)).toString()
  // It is not always true that the metadata URI contains the token ID, but
  // it is true for the cases we are testing
  // expect(results[0].metadataUri).toContain(num)
}

describe('CryptoWalletNftDiviner', () => {
  const cases = [
    {
      address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      chainId: 1,
      results: { tokenURI: { args: ['0x0f'], result: 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/15' } },
      schema: EvmCallResultsSchema,
    },
  ] as EvmCallResults[]
  let diviner: EvmCallResultToNftTokenUriDiviner
  beforeAll(async () => {
    diviner = await EvmCallResultToNftTokenUriDiviner.create({
      account: 'random',
      config: { schema: EvmCallResultToNftTokenUriDivinerConfigSchema },
    })
  })
  describe('divine', () => {
    it.each(cases)('transforms the input to the result', async (evmCallResult) => {
      const result = await diviner.divine([evmCallResult])
      validateResult(evmCallResult, result)
    })
  })
})
