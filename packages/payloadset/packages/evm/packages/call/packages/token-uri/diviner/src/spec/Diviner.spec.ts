// eslint-disable-next-line workspaces/no-absolute-imports
import { EvmCallResults, EvmCallResultsSchema } from '@xyo-network/evm-call-witness'
import { isNftMetadataUri } from '@xyo-network/evm-nft-id-payload-plugin'
import { Payload } from '@xyo-network/payload-model'

import { EvmCallResultToNftTokenUriDiviner, EvmCallResultToNftTokenUriDivinerConfigSchema } from '../Diviner'

const validateResult = (observation: Payload[]) => {
  const results = observation.filter(isNftMetadataUri)
  expect(results.length).toBeGreaterThan(0)
  expect(observation.length).toEqual(results.length)
}

describe('CryptoWalletNftDiviner', () => {
  const address = '0x55296f69f40ea6d20e478533c15a6b08b654e758' //XYO ERC20
  const chainId = 1
  const args = ['0xaDe7DFBC532A01dB67BFEA3b728D4eA22869f381'] //Random Holder
  const cases = [[address, chainId, { balanceOf: { args, result: '0x0' } }]] as const
  describe('divine', () => {
    it.each(cases)('uses values from config', async (address, chainId, results) => {
      const diviner = await EvmCallResultToNftTokenUriDiviner.create({
        account: 'random',
        config: { schema: EvmCallResultToNftTokenUriDivinerConfigSchema },
      })
      const evmCallResults: EvmCallResults = { address, chainId, results, schema: EvmCallResultsSchema }
      const result = await diviner.divine([evmCallResults])
      validateResult(result)
    })
  })
})
