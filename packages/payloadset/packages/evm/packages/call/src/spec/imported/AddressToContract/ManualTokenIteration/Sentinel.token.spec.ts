/* eslint-disable max-statements */

import { hexFrom } from '@xylabs/hex'
import { HDWallet } from '@xyo-network/account'
import type { ContractInfo } from '@xyo-network/crypto-contract-function-read-payload-plugin'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import type { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest'
import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { ERC721__factory, ERC721Enumerable__factory, ERC1155__factory } from '@xyo-network/open-zeppelin-typechain'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import { asSentinelInstance } from '@xyo-network/sentinel-model'
import { getProvidersFromEnv } from '@xyo-network/witness-evm-abstract'
import { asWitnessInstance } from '@xyo-network/witness-model'
import { Semaphore } from 'async-mutex'

import type { EvmCallResults } from '../../../../Diviner.ts'
import { EvmCallDiviner, EvmCallResultsSchema } from '../../../../Diviner.ts'
import type { EvmCall } from '../../../../Payload.ts'
import { EvmCallResultSchema, EvmCallSchema } from '../../../../Payload.ts'
import { EvmCallWitness } from '../../../../Witness.ts'
import erc721SentinelManifest from '../Erc721Sentinel.json'

const profileData: Record<string, number[]> = {}

const profile = (name: string) => {
  const timeData = profileData[name] ?? []
  timeData.push(Date.now())
  profileData[name] = timeData
}

const profileReport = () => {
  let lowest = Date.now()
  let highest = 0
  // eslint-disable-next-line unicorn/no-array-reduce
  const results = Object.entries(profileData).reduce<Record<string, number>>((prev, [name, readings]) => {
    const start = readings.at(0)
    if (start) {
      if (start < lowest) {
        lowest = start
      }
      const end = readings.at(-1) ?? Date.now()
      if (end > highest) {
        highest = end
      }
      prev[name] = end - start
    }
    return prev
  }, {})
  if (highest) {
    results['-all-'] = highest - lowest
  }
  return results
}

let tokenCount = 0

describe.skip('Erc721Sentinel', () => {
  // const address = '0x562fC2927c77cB975680088566ADa1dC6cB8b5Ea' //Random ERC721
  const address = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' // Bored Apes

  describe('report', () => {
    it('specifying address', async () => {
      profile('setup')
      const mnemonic = 'later puppy sound rebuild rebuild noise ozone amazing hope broccoli crystal grief'
      const wallet = await HDWallet.fromPhrase(mnemonic)
      const locator = new ModuleFactoryLocator()
      locator.register(EvmCallDiviner)

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721__factory.abi },
          providers: getProvidersFromEnv,
        }),
        { 'network.xyo.evm.interface': 'Erc721' },
      )

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC721Enumerable__factory.abi },
          providers: getProvidersFromEnv,
        }),
        { 'network.xyo.evm.interface': 'Erc721Enumerable' },
      )

      locator.register(
        new ModuleFactory(EvmCallWitness, {
          config: { abi: ERC1155__factory.abi },
          providers: getProvidersFromEnv,
        }),
        { 'network.xyo.evm.interface': 'Erc1155' },
      )
      profile('setup')
      profile('manifest')
      const manifest = new ManifestWrapper(erc721SentinelManifest as PackageManifestPayload, wallet, locator)
      profile('manifest-load')
      const node = await manifest.loadNodeFromIndex(0)
      profile('manifest-load')
      profile('manifest-resolve')
      const mods = await node.resolve('*')
      profile('manifest-resolve')
      profile('manifest')
      expect(mods.length).toBeGreaterThan(5)

      const collectionSentinel = asSentinelInstance(await node.resolve('NftInfoSentinel'))
      expect(collectionSentinel).toBeDefined()

      const tokenSentinel = asSentinelInstance(await node.resolve('NftTokenInfoSentinel'))
      expect(tokenSentinel).toBeDefined()

      const nameWitness = asWitnessInstance(await node.resolve('Erc721NameWitness'))
      expect(nameWitness).toBeDefined()

      const symbolWitness = asWitnessInstance(await node.resolve('Erc721SymbolWitness'))
      expect(symbolWitness).toBeDefined()

      const diviner = asDivinerInstance(await node.resolve('Erc721ContractInfoDiviner'))
      expect(diviner).toBeDefined()

      const collectionCallPayload: EvmCall = { address, schema: EvmCallSchema }
      profile('collectionReport')
      const report = await collectionSentinel?.report([collectionCallPayload])
      profile('collectionReport')
      profile('tokenCallSetup')
      const info = report?.find(isPayloadOfSchemaType(EvmCallResultsSchema)) as EvmCallResults | undefined

      const totalSupply = info?.results?.totalSupply ? BigInt(hexFrom(info.results.totalSupply.result as string, { prefix: true })) : 0n
      expect(totalSupply).toBeGreaterThan(0n)

      const chunkSize = 100n
      const maxChunks = totalSupply / chunkSize
      const chunks: EvmCall[][] = []

      let offset = 0n
      while (offset < totalSupply && chunks.length < maxChunks) {
        offset = BigInt(chunks.length) * chunkSize

        const chunkList: EvmCall[] = []

        for (let i = offset; i < offset + chunkSize && i < totalSupply; i++) {
          const call: EvmCall = {
            address,
            args: [`0x${BigInt(i).toString(16)}`],
            functionName: 'tokenByIndex',
            schema: EvmCallSchema,
          }
          chunkList.push(call)
        }
        chunks.push(chunkList)
      }
      profile('tokenCallSetup')
      const maxConcurrent = 8
      if (tokenSentinel) {
        profile('tokenReport')
        const semaphore = new Semaphore(maxConcurrent)
        const tokenReportArrays = await Promise.all(
          chunks.map(async (chunk) => {
            return await semaphore.runExclusive(async () => {
              const result = await tokenSentinel.report(chunk)
              return result
            })
          }),
        )
        profile('tokenReport')
        const tokenReport = tokenReportArrays.flat()
        tokenCount = tokenReport.length
        const tokenInfoPayloads = tokenReport.filter(isPayloadOfSchemaType(EvmCallResultSchema)) as ContractInfo[]
        expect(BigInt(tokenInfoPayloads.length)).toBe(totalSupply)
      }
    })
    afterAll(() => {
      const profileData = profileReport()
      if (profileData['tokenReport']) console.log(`Timer: ${profileData['tokenReport'] / tokenCount}ms`)
      console.log(`Profile: ${JSON.stringify(profileData, null, 2)}`)
    })
  })
})
