import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerInstance, DivinerModuleEventData } from '@xyo-network/diviner-model'
import { creatableModule } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'

import { Html } from '../Payload.ts'
import { HtmlSchema } from '../Schema.ts'
import { hasStringDataField, StringDataField, toHtml } from './lib/index.ts'
import { HtmlQuerySelectorDivinerParams } from './Params.ts'
import { HtmlQuerySelectorDivinerConfigSchema } from './Schema.ts'

@creatableModule()
export class HtmlQuerySelectorDiviner<
  TParams extends HtmlQuerySelectorDivinerParams = HtmlQuerySelectorDivinerParams,
  TIn extends Payload<StringDataField> = Payload<StringDataField>,
  TOut extends Html | Payload = Html | Payload,
  TEventData extends DivinerModuleEventData<DivinerInstance<TParams, TIn, TOut>, TIn, TOut> = DivinerModuleEventData<
    DivinerInstance<TParams, TIn, TOut>,
    TIn,
    TOut
  >,
> extends AbstractDiviner<TParams, TIn, TOut, TEventData> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, HtmlQuerySelectorDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = HtmlQuerySelectorDivinerConfigSchema
  static override targetSchema = HtmlSchema

  protected override async divineHandler(payloads: TIn[] = []): Promise<TOut[]> {
    const results = await Promise.all(payloads.filter(hasStringDataField).map(toHtml))
    return results as TOut[]
  }
}
