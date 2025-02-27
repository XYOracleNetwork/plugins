import { Payload } from '@xyo-network/payload-model'
import { DomainEstimate, Estimate } from '@xyo-network/xns-record-payload-plugins'
import {
  describe, expect, it,
} from 'vitest'

import { parseDomainEstimates } from '../parseDomainEstimates.ts'
import { matchers } from './matchers/index.ts'

expect.extend(matchers)

describe('parseDomainEstimates', () => {
  const estimateA: DomainEstimate = [
    {
      addresses: ['93130bb7cf9b059ed6e29b50f29b569a2094bd5e'],
      payload_hashes: [
        '49699c9d1cfb1a8643037c9557123a9e643a3dd938f619af39b94966ecfdd6ff',
        'af31f9d6afd8f7cbbe5c3310f2a2da9e1af31d1b7cf8dae7d9786848de1e5bd7',
      ],
      payload_schemas: [
        'network.xyo.hash.lease.estimate',
        'network.xyo.ns.domain.registration.lease',
      ],
      previous_hashes: [null],
      schema: 'network.xyo.boundwitness',
      $signatures: [
        '6595022e974dae953b6ea145e6c0ca75211afd713a88b6d989e9d00da4e183ad427df8a8175ba46688c5345349464645befe1f2250ecfdc6bdb3cf9c27b65931',
      ],
    },
    {
      schema: 'network.xyo.hash.lease.estimate',
      currency: 'USD',
      exp: 1_725_225_427_392,
      nbf: 1_724_966_227_392,
      price: 16,
      $sources: ['dcc7ab18c86d90311bb1b59361f6698e2714294a91aa3126c554aa8483a7ae37'],
    },
    {
      schema: 'network.xyo.ns.domain.registration.lease',
      domain: 'test8446e171-46ca-47d5-a3b7-1a658cb7f451',
      exp: 1_756_502_227_392,
      nbf: 1_724_966_227_392,
      registrant: ['1b2c45910fb0d32cb1d1cd010cbc594bf05969b5'],
      registrar: ['846c35ce6ec62e4608a1215e14b5b16471904153'],
      $sources: ['fccd06633e70c2168c8eb0eb5e25b22e34c1c417a46d5073034ec977dfc1995d', 'd7f40698fb0b0261834ef694ed275b4e6547e329cedc1c56708f098a5608b93a'],
      tld: 'xyo',
    },
  ]
  const estimateB: Estimate = [
    {
      addresses: ['6a2cb2545c71f84235346643a9f562a973d6adef'],
      payload_hashes: [
        'abb7ecb2cfc51e1a95f85477b3a4210a72886d5b22fcf32043736c48e2873f2c',
        '3ed825d48507b899395ca943e1dd6ec9a7c948e1cd1573a6cfda66de83af4b11',
      ],
      payload_schemas: [
        'network.xyo.hash.lease.estimate',
        'network.xyo.ns.domain.registration.lease',
      ],
      previous_hashes: [null],
      schema: 'network.xyo.boundwitness',
      $signatures: [
        '2ff62a32daaa97f1b316dc07eaeae594a3d57c07bb03fa38c44dd803b192d13b47311a0954440233826a3ae10f6540d991947dad64c8a563e74ae78cd245657f',
      ],
    },
    {
      schema: 'network.xyo.hash.lease.estimate',
      currency: 'USD',
      exp: 1_725_225_514_773,
      nbf: 1_724_966_314_773,
      price: 16,
      $sources: ['90259bc9ecde9d4c0061bc92dbfcf32e0f7b2603e49443d9f3c67a6d7e82c7d5'],
    },
    {
      schema: 'network.xyo.ns.domain.registration.lease',
      domain: 'testb88a0ee2-9665-48b3-b9c6-047eadc475ee',
      exp: 1_756_502_314_773,
      nbf: 1_724_966_314_773,
      registrant: ['1b2c45910fb0d32cb1d1cd010cbc594bf05969b5'],
      registrar: ['846c35ce6ec62e4608a1215e14b5b16471904153'],
      $sources: ['407ed63c0c36fadae7ae8d16a42b678551e0ea6aa5357b76f0ffc1bce3ba2f22', 'ced04c0a3f65bbefde58ba0d15767fcee20b6e25d3820f90c55f44f18effa70f'],
      tld: 'xyo',
    },
  ]
  describe('with valid symmetric data', () => {
    const cases: Payload[][] = [
      [...estimateA],
      [...estimateB],
      [...estimateA, ...estimateB],
      [...estimateB, ...estimateA],
    ]
    it.each(cases)('parses estimates from array', async (...data) => {
      // const signer = await HDWallet.random()
      // const [bw] = await new BoundWitnessBuilder().signer(signer).payloads([estimateB[1], estimateB[2]]).build()
      expect(await parseDomainEstimates(data)).toMatchSnapshot()
    })
  })
  describe('with valid jagged data', () => {
    const cases: Payload[][] = [
      estimateA.slice(0, -1),
      estimateB.slice(0, -1),
      [...estimateB],
      [...estimateA, ...estimateB.slice(0, -1)],
      [...estimateB, ...estimateA.slice(0, -1)],
    ]
    it.each(cases)('parses estimates from array', async (...data) => {
      expect(await parseDomainEstimates(data)).toMatchSnapshot()
    })
  })
  describe('with no data', () => {
    it('returns empty array', async () => {
      expect(await parseDomainEstimates([])).toBeArrayOfSize(0)
    })
  })
})
