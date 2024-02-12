import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { FileSchema } from './Schema'

export type BinaryDataHash = string

/** @description File location and optional data */
export type FilePayload = Payload<
  {
    created?: number
    hash: BinaryDataHash
    length: number
    /** @field Storage specific meta data */
    meta?: Record<string, string | number>
    modified?: number
    uri: string
  },
  FileSchema
>

export const isFilePayload = isPayloadOfSchemaType<FilePayload>(FileSchema)
