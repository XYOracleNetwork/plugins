import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { Crypto } from '@xylabs/crypto'

export const hashFile = (url: string): Promise<string> => {
  const path = url.startsWith('file://') ? fileURLToPath(url) : url
  const ret = new Promise<string>((resolve, reject) => {
    const hash = Crypto.createHash('sha256')
    const stream = createReadStream(path)
    stream.on('data', (data) => {
      hash.update(data)
    })
    stream.on('end', () => {
      resolve(hash.digest('hex'))
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })
  return ret
}
