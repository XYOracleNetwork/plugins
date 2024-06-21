import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerInstance, DivinerModuleEventData } from '@xyo-network/diviner-model'
import { creatableModule } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import { Parser } from 'xml2js'

import { Xml } from '../Payload'
import { XmlSchema } from '../Schema'
import { XmlParsingDivinerParams } from './Params'
import { XmlParsingDivinerConfigSchema } from './Schema'

@creatableModule()
export class XmlParsingDiviner<
  TParams extends XmlParsingDivinerParams = XmlParsingDivinerParams,
  TIn extends Payload<{ data: string }> = Payload<{ data: string }>,
  TOut extends Xml | Payload = Xml | Payload,
  TEventData extends DivinerModuleEventData<DivinerInstance<TParams, TIn, TOut>, TIn, TOut> = DivinerModuleEventData<
    DivinerInstance<TParams, TIn, TOut>,
    TIn,
    TOut
  >,
> extends AbstractDiviner<TParams, TIn, TOut, TEventData> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, XmlParsingDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = XmlParsingDivinerConfigSchema
  static override targetSchema = XmlSchema

  protected override async divineHandler(payloads: TIn[] = []): Promise<TOut[]> {
    const results = await Promise.all(
      payloads.filter(isDataLike).map((payload) => {
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
      }),
    )
    return results as TOut[]
  }
}

const isDataLike = (dataLike?: unknown): dataLike is { data: string } => {
  return typeof dataLike === 'object' && dataLike !== null && 'data' in dataLike && typeof (dataLike as { data: unknown }).data === 'string'
}

const toXml = (payload: { data: string }): Promise<Xml> => {
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
