/* eslint-disable sonarjs/deprecation */
import '@xylabs/vitest-extended'

import {
  CryptoContractFunctionCallSchema,
  isCryptoContractFunctionCallResult,
  isCryptoContractFunctionCallSuccess,
} from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness-memory'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { GenericPayloadDiviner } from '@xyo-network/diviner-payload-generic'
import { PayloadDivinerQuerySchema } from '@xyo-network/diviner-payload-model'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import type { MemoryNode } from '@xyo-network/node-memory'
import { ERC721Enumerable__factory } from '@xyo-network/open-zeppelin-typechain'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { HDWallet } from '@xyo-network/wallet'
import type { WalletInstance } from '@xyo-network/wallet-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import { TimestampWitness } from '@xyo-network/witness-timestamp'
import type { Provider } from 'ethers'
import {
  beforeAll, describe, expect,
  it,
} from 'vitest'

import { CryptoContractDiviner } from '../../Diviner/index.ts'
import type { CryptoContractFunctionReadWitnessParams } from '../../Witness.ts'
import { CryptoContractFunctionReadWitness } from '../../Witness.ts'
import erc721TotalSupplyIndexManifest from './Erc721.TotalSupply.Index.json' with { type: 'json' }

const maxProviders = 32

describe.skipIf(!process.env.INFURA_PROJECT_ID)('Erc721.TotalSupply.Index', () => {
  let wallet: WalletInstance
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
    locator.register(MemoryBoundWitnessDiviner.factory())
    locator.register(GenericPayloadDiviner.factory())
    locator.register(TimestampWitness.factory())

    locator.register(CryptoContractDiviner.factory())
    locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner.factory())
    locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner.factory())
    locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner.factory())
    locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner.factory())
    locator.register(TemporalIndexingDiviner.factory())

    locator.register(

      new ModuleFactory(CryptoContractFunctionReadWitness, {
        config: { abi: ERC721Enumerable__factory.abi },
        providers: getProviders(),
      } as CryptoContractFunctionReadWitnessParams),
      { 'network.xyo.evm.interface': 'Erc721Enumerable' },
    )
    const manifest = new ManifestWrapper(erc721TotalSupplyIndexManifest as PackageManifestPayload, wallet, locator)
    node = await manifest.loadNodeFromIndex(0)
  })
  type TestData = readonly [string]
  const cases: readonly TestData[] = [
    ['0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'], // BAYC
  ] as const
  describe.skipIf(!process.env.INFURA_PROJECT_ID)('Sentinel', () => {
    describe('Sentinel', () => {
      it.each(cases)('returns totalSupply', async (address) => {
        const sentinel = asSentinelInstance(await node.resolve('Sentinel'))
        const input = {
          address, chainId: 1, schema: CryptoContractFunctionCallSchema,
        }
        const observations = await sentinel?.report([input])
        expect(observations?.length).toBe(3)
        const totalSupply = observations?.filter(isCryptoContractFunctionCallResult).find(isCryptoContractFunctionCallSuccess)
        expect(totalSupply).toBeDefined()
        expect(totalSupply?.result).toBeString()
        const totalSupplyValue = totalSupply?.result as string
        expect(Number.parseInt(totalSupplyValue)).toBeNumber()
      })
    })
    describe('Index', () => {
      beforeAll(async () => {
        const delay = (ms: number) => {
          return new Promise(resolve => setTimeout(resolve, ms))
        }
        // Delay enough time for the diviners to index the results
        await delay(4000)
      })
      it.each(cases)('returns indexed result', async (address) => {
        const diviner = asDivinerInstance(await node.resolve('IndexDiviner'))
        expect(diviner).toBeDefined()
        const query = {
          address, chainId: 1, schema: PayloadDivinerQuerySchema,
        }
        const result = await diviner?.divine([query])
        expect(result).toBeDefined()
        expect(result).toBeArrayOfSize(1)
      })
    })
  })
})
