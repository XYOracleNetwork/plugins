/* eslint-disable max-statements */
import { HDWallet } from '@xyo-network/account'
import {
  ContractInfo,
  ContractInfoSchema,
  CryptoContractFunctionCall,
  CryptoContractFunctionCallSchema,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { ERC721__factory, ERC721Enumerable__factory, ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { Provider } from 'ethers'

import { CryptoContractDiviner } from '../Diviner'
import { CryptoContractFunctionReadWitness } from '../Witness'
import manifestFile from './Contract.Sentinel.Index.json'

const maxProviders = 32

describe('Erc721Sentinel', () => {
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' // Bored Apes
  // const address = '0x7daec605e9e2a1717326eedfd660601e2753a057' // 10ktf-stockroom

  const getProviders = () => {
    const providers: Provider[] = []
    for (let i = 0; i < maxProviders; i++) {
      providers.push(getProviderFromEnv())
    }
    return providers
  }

  describe('report', () => {
    it('specifying address', async () => {
      const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
      const wallet = await HDWallet.fromPhrase(mnemonic)
      const locator = new ModuleFactoryLocator()
      locator.register(CryptoContractDiviner)

      locator.register(
        new ModuleFactory(CryptoContractFunctionReadWitness, {
          config: { abi: ERC721__factory.abi },
          providers: getProviders(),
        }),
        { 'network.xyo.crypto.contract.interface': 'Erc721' },
      )

      locator.register(
        new ModuleFactory(CryptoContractFunctionReadWitness, {
          config: { abi: ERC721Enumerable__factory.abi },
          providers: getProviders(),
        }),
        { 'network.xyo.crypto.contract.interface': 'Erc721Enumerable' },
      )

      locator.register(
        new ModuleFactory(CryptoContractFunctionReadWitness, {
          config: { abi: ERC1155__factory.abi },
          providers: getProviders(),
        }),
        { 'network.xyo.crypto.contract.interface': 'Erc1155' },
      )
      locator.register(JsonPatchDiviner)
      const manifest = new ManifestWrapper(manifestFile as PackageManifestPayload, wallet, locator)
      const node = await manifest.loadNodeFromIndex(0)
      const collectionSentinel = asSentinelInstance(await node.resolve('NftInfoSentinel'))
      expect(collectionSentinel).toBeDefined()
      const collectionCallPayload: CryptoContractFunctionCall = { address, schema: CryptoContractFunctionCallSchema }
      const report = await collectionSentinel?.report([collectionCallPayload])
      const info = report?.find(isPayloadOfSchemaType(ContractInfoSchema)) as ContractInfo | undefined
      expect(info?.results?.name).toBe('BoredApeYachtClub')
      expect(info?.results?.symbol).toBe('BAYC')
    })
  })
})
