import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerConfig, DivinerInstance, DivinerModuleEventData, DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema, creatableModule } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'

import { Xml } from './Payload'
import { XmlSchema } from './Schema'

export const XmlParsingDivinerConfigSchema = 'network.xyo.diviner.xml.config' as const
export type XmlParsingDivinerConfigSchema = typeof XmlParsingDivinerConfigSchema

export type XmlParsingDivinerConfig = DivinerConfig<
  {
    //
  },
  XmlParsingDivinerConfigSchema
>

export type XmlParsingDivinerParams<TConfig extends AnyConfigSchema<XmlParsingDivinerConfig> = AnyConfigSchema<XmlParsingDivinerConfig>> =
  DivinerParams<TConfig>

@creatableModule()
export class XmlParsingDiviner<
  TParams extends XmlParsingDivinerParams = XmlParsingDivinerParams,
  TIn extends Payload = Payload,
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

  protected override async divineHandler(_payloads: TIn[] = []): Promise<TOut[]> {
    return await Promise.resolve([])
  }
}
