import { Parser } from 'xml2js'

import type { Xml } from '../../Payload.ts'
import { XmlSchema } from '../../Schema.ts'
import type { StringDataField } from './StringDataField.ts'

/**
 * Takes a string data field containing xml and converts it to an XML object
 * @param obj The input object which contains the stringified xml data
 * @returns A promise that resolves to an XML payload
 */
export const toXml = (obj: StringDataField): Promise<Xml> => {
  const parser = new Parser()
  return new Promise<Xml>((resolve, reject) => {
    parser.parseString(obj.data, (err, result) => {
      if (err) {
        reject(err)
      } else {
        const xml = { schema: XmlSchema, xml: result } as const
        resolve(xml)
      }
    })
  })
}
