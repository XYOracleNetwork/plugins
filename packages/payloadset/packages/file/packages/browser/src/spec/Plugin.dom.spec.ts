import '@xylabs/vitest-extended'

import {
  beforeEach, describe, expect, test,
} from 'vitest'

import { BrowserFileWitness } from '../BrowserFileWitness.ts'
import { FileWitnessConfigSchema } from '../Config.ts'
import { isFilePayload } from '../Payload.ts'

// Leave off modified since its a timestamp and won't be known till the test runs
const expectedFilePayload = {
  hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  length: 4,
  meta: { name: 'test.txt', type: 'text/plain' },
  schema: 'network.xyo.file',
  uri: 'data:application/octet-stream;base64,dGVzdA==',
}

describe('FileWitness', () => {
  let browserFileWitness: BrowserFileWitness

  beforeEach(async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    browserFileWitness = await BrowserFileWitness.create({
      account: 'random',
      config: {
        name: 'BrowserFileWitness', schema: FileWitnessConfigSchema, storage: 'data-uri',
      },
      ...(file ? { file } : {}),
    })
  })

  test('BrowserFileWitness', async () => {
    expect(browserFileWitness).toBeDefined()
    const [payload] = await browserFileWitness.observe()
    expect(isFilePayload(payload)).toBeTrue()
    expect(payload).toMatchObject(expectedFilePayload)
  })
})
