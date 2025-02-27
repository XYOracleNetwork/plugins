import '@xylabs/vitest-extended'

import { isNftMetadataUri, NftMetadataUriSchema } from '@xyo-network/evm-nft-id-payload-plugin'
import { Payload } from '@xyo-network/payload-model'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { EvmCallResultToNftTokenUriDivinerConfigSchema } from '../Config.ts'
import { EvmCallResultToNftTokenUriDiviner } from '../Diviner.ts'
import { EvmTokenUriCallResults } from '../Payload.ts'

const validateResult = (evmCallResults: EvmTokenUriCallResults, actual: Payload[]) => {
  const results = actual.filter(isNftMetadataUri)
  expect(results.length).toBe(1)
  const {
    address,
    chainId,
    results: { tokenURI: { args: [tokenId] } },
  } = evmCallResults
  expect(results[0].address).toBe(address)
  expect(results[0].chainId).toBe(chainId)
  expect(results[0].tokenId).toBe(tokenId)
  expect(results[0].schema).toBe(NftMetadataUriSchema)
  expect(results[0].metadataUri).toBeString()
  const num = Number(BigInt(tokenId)).toString()
  // It is not always true that the metadata URI contains the token ID, but
  // it is true for the cases we are testing
  expect(results[0].metadataUri).toContain(num)
}

describe('CryptoWalletNftDiviner', () => {
  const cases = [
    {
      address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      chainId: 1,
      results: { tokenURI: { args: ['0x0f'], result: 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/15' } },
      schema: 'network.xyo.evm.call.results',
    },
    {
      address: '0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452',
      chainId: 1,
      results: { tokenURI: { args: ['0x543'], result: 'https://gutter-cats-metadata.s3.us-east-2.amazonaws.com/metadata/1347' } },
      schema: 'network.xyo.evm.call.results',
    },
  ] as EvmTokenUriCallResults[]
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
    // eslint-disable-next-line sonarjs/assertions-in-tests
    it('replaced values in templatized results', async () => {
      const evmCallResult = {
        address: '0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452',
        chainId: 1,
        results: { tokenURI: { args: ['0x543'], result: 'https://gutter-cats-metadata.s3.us-east-2.amazonaws.com/metadata/{id}' } },
        schema: 'network.xyo.evm.call.results',
      } as EvmTokenUriCallResults
      const result = await diviner.divine([evmCallResult])
      validateResult(evmCallResult, result)
    })
  })
})
