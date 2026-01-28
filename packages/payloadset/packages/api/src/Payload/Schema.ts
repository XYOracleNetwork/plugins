import { asSchema } from '@xyo-network/payload-model'

export const ApiCallSchema = asSchema('network.xyo.api.call', true)
export type ApiCallSchema = typeof ApiCallSchema

export const ApiCallResultSchema = asSchema(`${ApiCallSchema}.result`, true)
export type ApiCallResultSchema = typeof ApiCallResultSchema
