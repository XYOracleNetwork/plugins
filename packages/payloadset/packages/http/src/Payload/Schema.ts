import { asSchema } from '@xyo-network/payload-model'

export const HttpCallSchema = asSchema('network.xyo.http.call', true)
export type HttpCallSchema = typeof HttpCallSchema

export const HttpCallResultSchema = asSchema(`${HttpCallSchema}.result`, true)
export type HttpCallResultSchema = typeof HttpCallResultSchema
