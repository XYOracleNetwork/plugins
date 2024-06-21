import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerInstance, DivinerModuleEventData } from '@xyo-network/diviner-model'
import { creatableModule } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'

import { Xml } from '../Payload'
import { XmlSchema } from '../Schema'
import { hasStringDataField, StringDataField, toXml } from './lib'
import { XmlParsingDivinerParams } from './Params'
import { XmlParsingDivinerConfigSchema } from './Schema'

@creatableModule()
export class XmlParsingDiviner<
  TParams extends XmlParsingDivinerParams = XmlParsingDivinerParams,
  TIn extends Payload<StringDataField> = Payload<StringDataField>,
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
    const results = await Promise.all(payloads.filter(hasStringDataField).map(toXml))
    return results as TOut[]
  }
}
