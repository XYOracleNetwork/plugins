import { asSchema } from '@xyo-network/payload-model'

export const XmlSchema = asSchema('network.xyo.xml', true)
export type XmlSchema = typeof XmlSchema
