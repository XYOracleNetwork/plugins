import { asSchema } from '@xyo-network/payload-model'

export type FileSchema = typeof FileSchema
export const FileSchema = asSchema('network.xyo.file', true)
