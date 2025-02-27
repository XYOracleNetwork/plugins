import { Payload } from '@xyo-network/payload-model'

import { NftSchema } from '../Schema.ts'
import { NftInfoFields } from './NftInfo/index.ts'

export type NftInfo = Payload<NftInfoFields, NftSchema>

export const isNftInfo = (payload: Payload): payload is NftInfo => {
  return payload.schema === NftSchema
}
