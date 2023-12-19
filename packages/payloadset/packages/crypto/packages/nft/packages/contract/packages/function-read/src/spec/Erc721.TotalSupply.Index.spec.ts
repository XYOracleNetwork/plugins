/* eslint-disable max-statements */

import { hexFromHexString } from '@xylabs/hex'
import { HDWallet } from '@xyo-network/account'
import {
  ContractInfo,
  ContractInfoSchema,
  CryptoContractFunctionCall,
  CryptoContractFunctionCallResultSchema,
  CryptoContractFunctionCallSchema,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload-memory'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { ManifestWrapper, PackageManifestPayload } from '@xyo-network/manifest'
import { ModuleFactory, ModuleFactoryLocator } from '@xyo-network/module-model'
import { MemoryNode } from '@xyo-network/node-memory'
import { ERC721__factory, ERC721Enumerable__factory, ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { asWitnessInstance } from '@xyo-network/witness-model'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import { Semaphore } from 'async-mutex'
import { Provider } from 'ethers'

import { CryptoContractDiviner } from '../Diviner'
import { CryptoContractFunctionReadWitness } from '../Witness'
import erc721TotalSupplyIndexManifest from './Erc721.TotalSupply.Index.json'

const profileData: Record<string, number[]> = {}

const profile = (name: string) => {
  const timeData = profileData[name] ?? []
  timeData.push(Date.now())
  profileData[name] = timeData
}
const tokenCount = 0
const maxProviders = 32

describe('Erc721.TotalSupply.Index', () => {
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' //Bored Apes
  let wallet: HDWallet
  let node: MemoryNode

  const getProviders = () => {
    const providers: Provider[] = []
    for (let i = 0; i < maxProviders; i++) {
      providers.push(getProviderFromEnv())
    }
    return providers
  }
  beforeAll(async () => {
    const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
    wallet = await HDWallet.fromPhrase(mnemonic)
    const locator = new ModuleFactoryLocator()
    locator.register(MemoryBoundWitnessDiviner)
    locator.register(MemoryPayloadDiviner)
    locator.register(TimestampWitness)
    locator.register(CryptoContractDiviner)
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner, CryptoContractDiviner.labels)
    locator.register(TemporalIndexingDiviner, CryptoContractDiviner.labels)

    locator.register(
      new ModuleFactory(CryptoContractFunctionReadWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProviders(),
      }),
      { 'network.xyo.crypto.contract.interface': 'Erc721Enumerable' },
    )
    const manifest = new ManifestWrapper(erc721TotalSupplyIndexManifest as PackageManifestPayload, wallet, locator)
    node = await manifest.loadNodeFromIndex(0)
  })

  describe('todo', () => {
    it('todo', () => {
      // tests
    })
  })
})
