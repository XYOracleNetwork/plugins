import { filterAs } from '@xylabs/array'
import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { AsObjectFactory } from '@xylabs/object'
import { ArchivistInstance, ArchivistNextOptions } from '@xyo-network/archivist-model'
import { ArchivistWrapper } from '@xyo-network/archivist-wrapper'
import {
  asBoundWitness, BoundWitness, isBoundWitness,
} from '@xyo-network/boundwitness-model'
import { payloadSchemasContainsAll } from '@xyo-network/boundwitness-validator'
import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerWrapper } from '@xyo-network/diviner-wrapper'
import {
  ImageThumbnail, ImageThumbnailSchema, isImageThumbnail,
} from '@xyo-network/image-thumbnail-payload-plugin'
import {
  isModuleState, ModuleState, ModuleStateSchema,
} from '@xyo-network/module-model'
import {
  Payload, Schema, SequenceConstants,
} from '@xyo-network/payload-model'
import {
  isTimestamp, TimeStamp, TimestampSchema,
} from '@xyo-network/witness-timestamp'

import { ImageThumbnailDivinerLabels, ImageThumbnailDivinerStageLabels } from '../ImageThumbnailDivinerLabels.ts'
import { ImageThumbnailDivinerState } from '../ImageThumbnailDivinerState.ts'
import { ImageThumbnailStateToIndexCandidateDivinerConfigSchema } from './Config.ts'
import { ImageThumbnailStateToIndexCandidateDivinerParams } from './Params.ts'

/**
 * All Payload types involved in index candidates for indexing
 */
export type IndexCandidate = BoundWitness | ImageThumbnail | TimeStamp

/**
 * The response from the ImageThumbnailStateToIndexCandidateDiviner
 */
export type ImageThumbnailStateToIndexCandidateDivinerResponse = [
  /**
   * The next state of the diviner
   */
  nextState: ModuleState<ImageThumbnailDivinerState>,
  /**
   * The index candidates
   */
  ...IndexCandidate[],
]

/**
 * The required payload_schemas within BoundWitnesses to identify index candidates
 */
const payload_schemas = [ImageThumbnailSchema, TimestampSchema]

/**
 * Index candidate identity functions
 */
const indexCandidateIdentityFunctions = [isImageThumbnail, isTimestamp] as const
const isIndexCandidate = (x?: unknown | null): x is IndexCandidate => {
  return indexCandidateIdentityFunctions.map(is => is(x)).some(Boolean)
}
const asIndexCandidate = AsObjectFactory.create(isIndexCandidate)

/**
 * The default order to search Bound Witnesses to identify index candidates
 */
const order = 'asc'

/**
 * The name of the module (for logging purposes)
 */
const moduleName = 'ImageThumbnailStateToIndexCandidateDiviner'

/**
 * Transforms candidates for image thumbnail indexing into their indexed representation
 */
export class ImageThumbnailStateToIndexCandidateDiviner<
  TParams extends ImageThumbnailStateToIndexCandidateDivinerParams = ImageThumbnailStateToIndexCandidateDivinerParams,
> extends AbstractDiviner<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, ImageThumbnailStateToIndexCandidateDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = ImageThumbnailStateToIndexCandidateDivinerConfigSchema
  static override readonly labels: ImageThumbnailDivinerStageLabels = {
    ...super.labels,
    ...ImageThumbnailDivinerLabels,
    'network.xyo.diviner.stage': 'stateToIndexCandidateDiviner',
  }

  get payloadDivinerLimit() {
    return this.config.payloadDivinerLimit ?? 1000
  }

  protected static async getPayloadsInBoundWitness(bw: BoundWitness, archivist: ArchivistInstance): Promise<IndexCandidate[] | undefined> {
    const indexes = payload_schemas.map(schema => bw.payload_schemas?.findIndex(s => s === schema))
    const hashes = indexes.map(index => bw.payload_hashes?.[index])
    const results = await archivist.get(hashes)
    const filteredResults = indexCandidateIdentityFunctions.map(is => results.find(is))
    if (filteredResults.includes(undefined)) return undefined
    const indexCandidates: IndexCandidate[] = filterAs(filteredResults, asIndexCandidate)
    return [bw, ...indexCandidates]
  }

  protected override async divineHandler(payloads: Payload[] = []): Promise<ImageThumbnailStateToIndexCandidateDivinerResponse> {
    // Retrieve the last state from what was passed in
    const lastState = payloads.find(isModuleState<ImageThumbnailDivinerState>)
      // If there is no last state, start from the beginning
      ?? { schema: ModuleStateSchema, state: { cursor: SequenceConstants.minLocalSequence } }

    // Get the last cursor
    const cursor = lastState?.state?.cursor
    // Get the archivist for the store
    const sourceArchivist = await this.getArchivistForStore()
    if (!sourceArchivist) return [lastState]

    // Get the next batch of results
    const nextOffset: ArchivistNextOptions = { limit: this.payloadDivinerLimit, order }
    // Only use the cursor if it's a valid offset
    if (cursor !== SequenceConstants.minLocalSequence) nextOffset.cursor = cursor
    // Get next batch of results starting from the offset
    const next = await sourceArchivist.next(nextOffset)
    if (next.length === 0) return [lastState]

    const batch = filterAs(next, asBoundWitness)
      .filter(exists)
      .filter(bw => payloadSchemasContainsAll(bw, payload_schemas))
    // Get source data
    const indexCandidates: IndexCandidate[] = (await Promise.all(
      batch
        .filter(isBoundWitness)
        .map(bw => ImageThumbnailStateToIndexCandidateDiviner.getPayloadsInBoundWitness(bw, sourceArchivist)),
    ))
      .filter(exists)
      .flat()
    const nextCursor = assertEx(next.at(-1)?._sequence, () => `${moduleName}: Expected next to have a sequence`)
    const nextState: ModuleState<ImageThumbnailDivinerState> = { schema: ModuleStateSchema, state: { ...lastState.state, cursor: nextCursor } }
    return [nextState, ...indexCandidates]
  }

  /**
   * Retrieves the archivist for the payloadStore
   * @returns The archivist for the payloadStore
   */
  protected async getArchivistForStore() {
    const name = assertEx(this.config?.payloadStore?.archivist, () => `${moduleName}: Config for payloadStore.archivist not specified`)
    const mod = assertEx(await this.resolve(name), () => `${moduleName}: Failed to resolve payloadStore.archivist`)
    return ArchivistWrapper.wrap(mod, this.account)
  }

  /**
   * Retrieves the BoundWitness Diviner for the payloadStore
   * @returns The BoundWitness Diviner for the payloadStore
   */
  protected async getBoundWitnessDivinerForStore() {
    const name = assertEx(
      this.config?.payloadStore?.boundWitnessDiviner,
      () => `${moduleName}: Config for payloadStore.boundWitnessDiviner not specified`,
    )
    const mod = assertEx(await this.resolve(name), () => `${moduleName}: Failed to resolve payloadStore.boundWitnessDiviner`)
    return DivinerWrapper.wrap(mod, this.account)
  }
}
