/* eslint-disable max-statements */
import { HDWallet } from '@xyo-network/account'
import {
  CryptoContractFunctionCall,
  CryptoContractFunctionCallSchema,
  isErc721ContractInfo,
  isErc1155ContractInfo,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { JsonPatchDiviner } from '@xyo-network/diviner-jsonpatch'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721__factory, ERC721Enumerable__factory, ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { Provider } from 'ethers'

import { CryptoContractDiviner } from '../Diviner'
import { CryptoContractFunctionReadWitness } from '../Witness'
import manifestFile from './Contract.Sentinel.Index.json'

const maxProviders = 32

describe('Sentinel', () => {
  const cases: [string, string][] = [
    ['With ERC-721', '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'],
    ['With ERC-1155', '0xEdB61f74B0d09B2558F1eeb79B247c1F363Ae452'],
  ]
  const getProviders = () => {
    const providers: Provider[] = []
    for (let i = 0; i < maxProviders; i++) {
      providers.push(getProviderFromEnv())
    }
    return providers
  }
  describe('report', () => {
    let wallet: HDWallet
    let node: MemoryNode
    beforeAll(async () => {
      const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
      wallet = await HDWallet.fromPhrase(mnemonic)
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
      node = await manifest.loadNodeFromIndex(0)
    })
    it.each(cases)('%s', async (_, address) => {
      const collectionSentinel = asSentinelInstance(await node.resolve('NftInfoSentinel'))
      expect(collectionSentinel).toBeDefined()
      const collectionCallPayload: CryptoContractFunctionCall = { address, schema: CryptoContractFunctionCallSchema }
      const report = await collectionSentinel?.report([collectionCallPayload])
      let foundAny = false
      const erc721 = report?.find(isErc721ContractInfo)
      if (erc721) {
        foundAny = true
        expect(erc721?.results?.name).toBe('BoredApeYachtClub')
        expect(erc721?.results?.symbol).toBe('BAYC')
      }
      const erc1155 = report?.find(isErc1155ContractInfo)
      if (erc1155) {
        foundAny = true
        expect(erc1155?.results?.uri).toBeDefined()
      }
      expect(foundAny).toBe(true)
    })
  })
})
