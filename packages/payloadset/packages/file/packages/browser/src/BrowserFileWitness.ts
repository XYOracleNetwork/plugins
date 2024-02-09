import { assertEx } from '@xylabs/assert'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import shajs from 'sha.js'

import { FileWitnessConfigSchema } from './Config'
import { BrowserFileWitnessAdditionalParams } from './Params'
import { FilePayload } from './Payload'
import { FileSchema } from './Schema'
import { generateDataUri } from './util'
import { FileWitness, FileWitnessParams } from './Witness'

type BrowserFileWitnessParams = FileWitnessParams & BrowserFileWitnessAdditionalParams

export class BrowserFileWitness extends FileWitness<BrowserFileWitnessParams> {
  static override configSchemas = [FileWitnessConfigSchema]

  protected override async observeHandler() {
    try {
      const [payload] = await this.witnessBrowserFile()
      console.log(`BrowserFileWitness: ${await PayloadBuilder.hash(payload)}`)
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
    const file = assertEx(this.params.file, 'File is missing from params')
    const fileBinary = await this.readBinaryFile(file)
    const result = new Uint8Array(fileBinary)
    const hash = shajs('sha256').update(result).digest('hex').padStart(64, '0')

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
