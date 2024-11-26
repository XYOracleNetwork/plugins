import { fromByteArray } from 'base64-js'

export const createDataUrl = (data: ArrayBufferLike, contextType: string, encoding: 'base64' = 'base64') => {
  return `data:${contextType};${encoding},${fromByteArray(new Uint8Array(data))}`
}
