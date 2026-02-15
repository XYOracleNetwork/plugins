import { assertEx } from '@xylabs/sdk-js'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Schema } from '@xyo-network/payload-model'

import { FileWitnessConfigSchema } from './Config.ts'
import type { BrowserFileWitnessAdditionalParams } from './Params.ts'
import type { FilePayload } from './Payload.ts'
import { FileSchema } from './Schema.ts'
import { generateDataUri } from './util/index.ts'
import type { FileWitnessParams } from './Witness.ts'
import { FileWitness } from './Witness.ts'

type BrowserFileWitnessParams = FileWitnessParams & BrowserFileWitnessAdditionalParams

export class BrowserFileWitness extends FileWitness<BrowserFileWitnessParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, FileWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = FileWitnessConfigSchema

  protected override async observeHandler() {
    try {
      const [payload] = await this.witnessBrowserFile()
      const { logger } = this.params
      logger?.log(`BrowserFileWitness: ${await PayloadBuilder.dataHash(payload)}`)
      return [payload]
    } catch (e) {
      throw new Error(`Error reading file: ${e}`)
    }
  }

  private readBinaryFile(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer
        resolve(new Uint8Array(arrayBuffer))
      })
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      fileReader.onerror = () => reject(fileReader.error)
      // eslint-disable-next-line unicorn/prefer-blob-reading-methods
      fileReader.readAsArrayBuffer(file)
    })
  }

  private async witnessBrowserFile(): Promise<[FilePayload, Uint8Array]> {
    const file = assertEx(this.params.file, () => 'File is missing from params')
    const fileBinary = await this.readBinaryFile(file)
    const result = new Uint8Array(fileBinary)
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', result)

    // Convert ArrayBuffer to hex string
    const hashArray = [...new Uint8Array(hashBuffer)]
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return [
      {
        hash,
        length: fileBinary.byteLength,
        meta: {
          name: file.name,
          type: file.type,
        },
        modified: file.lastModified,
        schema: FileSchema,
        uri: this.config.storage === 'data-uri' ? generateDataUri(fileBinary) : file.name,
      },
      fileBinary,
    ]
  }
}
