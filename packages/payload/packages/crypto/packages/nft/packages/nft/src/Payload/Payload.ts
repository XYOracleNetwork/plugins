import { Payload } from '@xyo-network/payload-model'

import { NftSchema } from '../Schema.js'
import { NftInfoFields } from './NftInfo/index.js'

export type NftInfo = Payload<NftInfoFields, NftSchema>

export const isNftInfo = (payload: Payload): payload is NftInfo => {
  return payload.schema === NftSchema
}
