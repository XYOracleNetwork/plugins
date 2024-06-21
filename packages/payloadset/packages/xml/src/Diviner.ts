@creatableModule()
export class HashLeaseEstimateDiviner<
  TParams extends HashLeaseEstimateDivinerParams = HashLeaseEstimateDivinerParams,
  TIn extends Payload = Payload,
  TOut extends HashLeaseEstimate | Payload = HashLeaseEstimate | Payload,
  TEventData extends DivinerModuleEventData<DivinerInstance<TParams, TIn, TOut>, TIn, TOut> = DivinerModuleEventData<
    DivinerInstance<TParams, TIn, TOut>,
    TIn,
    TOut
  >,
> extends AbstractDiviner<TParams, TIn, TOut, TEventData> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, HashLeaseEstimateDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = HashLeaseEstimateDivinerConfigSchema
  static override targetSchema = HashLeaseEstimateSchema

  protected override async divineHandler(_payloads: TIn[] = []): Promise<TOut[]> {
    return await Promise.resolve([])
  }
}
