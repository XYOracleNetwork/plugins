import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { FileSchema } from './Schema.ts'

// eslint-disable-next-line sonarjs/redundant-type-aliases
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
