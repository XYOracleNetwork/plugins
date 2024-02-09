import { base64 } from '@scure/base'

export const generateDataUri = (data: Uint8Array): string => {
  return `data:application/octet-stream;base64,${base64.encode(data)}`
}
