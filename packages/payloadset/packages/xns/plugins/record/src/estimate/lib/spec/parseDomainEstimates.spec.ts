import type { Payload } from '@xyo-network/payload-model'
import type { DomainEstimate, Estimate } from '@xyo-network/xns-record-payload-plugins'
import {
  describe, expect, it,
} from 'vitest'

import { parseDomainEstimates } from '../parseDomainEstimates.ts'
import { matchers } from './matchers/index.ts'

expect.extend(matchers)

describe('parseDomainEstimates', () => {
  const estimateA: DomainEstimate = [
    {
      schema: 'network.xyo.boundwitness',
      addresses: ['2486705072e91a1d80d97cdcccd5db47b584e4bd'],
      payload_hashes: [
        'dcc7ab18c86d90311bb1b59361f6698e2714294a91aa3126c554aa8483a7ae37',
        '06882b9889a7649d7172e96c2c5046d5472685cf893c2e38dacd7ef154d7808d',
      ],
      payload_schemas: ['network.xyo.ns.domain.registration.lease', 'network.xyo.hash.lease.estimate'],
      previous_hashes: [null],
      $signatures: ['6d1f0d8d175f0bce32e5e474d263b0c6a815b698563a2d761464acea411bace051fe0fe720905688df8debfb13eed2979fd22f39d07922f06c8f5bebdafa5bb1'],
      $sourceQuery: 'd5cd65081af158789b481415644549d72cb6c5925ba68918c4ac55e92bf1f0e2',
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
      schema: 'network.xyo.boundwitness',
      addresses: ['2486705072e91a1d80d97cdcccd5db47b584e4bd'],
      payload_hashes: [
        '90259bc9ecde9d4c0061bc92dbfcf32e0f7b2603e49443d9f3c67a6d7e82c7d5', '7037fc16e12c7cffec09ed1d2ef3f65737668864be38f4a1268026d17601b5ca'],
      payload_schemas: ['network.xyo.ns.domain.registration.lease', 'network.xyo.hash.lease.estimate'],
      previous_hashes: [null],
      $signatures: ['ec17e78d94d256a0e4e9877855d92ed7bca7f7685ac42b5df87e6395331726a24f6a9271f3f058e1d35e06a11022ff359ccddbfa243772a8e45addad967afb6f'],
      $sourceQuery: '19b2b1e4e0e50747f2cb0134e61cda9523ff9f963a40f3fc9e8e9530834b360b',
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
