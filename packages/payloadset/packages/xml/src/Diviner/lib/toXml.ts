import { Parser } from 'xml2js'

import { Xml } from '../../Payload'
import { XmlSchema } from '../../Schema'

export const toXml = (payload: { data: string }): Promise<Xml> => {
  const parser = new Parser()
  return new Promise<Xml>((resolve, reject) => {
    parser.parseString(payload.data, (err, result) => {
      if (err) {
        reject(err)
      } else {
        const xml = { schema: XmlSchema, xml: result } as const
        resolve(xml)
      }
    })
  })
}
