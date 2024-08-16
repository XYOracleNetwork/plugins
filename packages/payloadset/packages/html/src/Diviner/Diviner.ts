import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerInstance, DivinerModuleEventData } from '@xyo-network/diviner-model'
import { creatableModule } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'

import { Html } from '../Payload.ts'
import { HtmlSchema } from '../Schema.ts'
import { hasStringDataField, querySelector, StringDataField } from './lib/index.ts'
import { HtmlQuerySelectorDivinerParams } from './Params.ts'
import { HtmlQuerySelectorDivinerConfigSchema } from './Schema.ts'

@creatableModule()
export class HtmlQuerySelectorDiviner<
  TParams extends HtmlQuerySelectorDivinerParams = HtmlQuerySelectorDivinerParams,
  TIn extends Payload<StringDataField> = Payload<StringDataField>,
  TOut extends Html = Html,
  TEventData extends DivinerModuleEventData<DivinerInstance<TParams, TIn, TOut>, TIn, TOut> = DivinerModuleEventData<
    DivinerInstance<TParams, TIn, TOut>,
    TIn,
    TOut
  >,
> extends AbstractDiviner<TParams, TIn, TOut, TEventData> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, HtmlQuerySelectorDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = HtmlQuerySelectorDivinerConfigSchema
  static override targetSchema = HtmlSchema
  private _querySelector: string | undefined

  protected get querySelector() {
    if (this._querySelector) return this._querySelector
    this._querySelector = assertEx(this.config.querySelectorAll || this.config.querySelector, () => 'No querySelector or querySelectorAll provided in config')
    return this._querySelector
  }

  protected override divineHandler(payloads: TIn[] = []) {
    return payloads.filter(hasStringDataField)
      .map(p => querySelector(p.data, this.querySelector))
      .filter(exists)
      .map((html) => { return { html, schema: HtmlSchema } }) as TOut[]
  }
}
