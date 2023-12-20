import { Payload } from '@xyo-network/payload-model'

import { NftSchema } from '../Schema'
import { NftInfoFields } from './Info'

export type NftInfo = Payload<NftInfoFields, NftSchema>

export const isNftInfo = (payload: Payload): payload is NftInfo => {
  return payload.schema === NftSchema
}
