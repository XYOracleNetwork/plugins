import { Html } from '../../Payload.ts'
import { HtmlSchema } from '../../Schema.ts'
import { StringDataField } from './StringDataField.ts'

/**
 * Takes a string data field containing html and converts it to an XML object
 * @param obj The input object which contains the stringified html data
 * @returns A promise that resolves to an XML payload
 */
export const toHtml = (obj: StringDataField): Promise<Html> => {
  const parser = new Parser()
  return new Promise<Html>((resolve, reject) => {
    parser.parseString(obj.data, (err, result) => {
      if (err) {
        reject(err)
      } else {
        const html = { schema: HtmlSchema, html: result } as const
        resolve(html)
      }
    })
  })
}
