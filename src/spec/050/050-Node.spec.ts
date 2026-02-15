import '@xylabs/vitest-extended'

import { readFile } from 'node:fs/promises'
import Path from 'node:path'

import { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { MemoryNode } from '@xyo-network/node-memory'
import type { PackageManifestPayload } from '@xyo-network/sdk-js'
import {
  Account, asSchema, ManifestWrapper,
} from '@xyo-network/sdk-js'
import { HDWallet } from '@xyo-network/wallet'
import { describe, it } from 'vitest'

describe('Node', () => {
  it('create', async () => {
    const node = await MemoryNode.create({ account: await Account.random() })
    const state = await node.state()
    console.log(state)
  })
  it('create from manifest', async () => {
    const wallet = await HDWallet.random()
    const manifest: PackageManifestPayload = {
      nodes: [
        {
          config: {
            name: 'Node',
            schema: asSchema('network.xyo.node.config', true),
          },
          modules: {
            private: [],
            public: [],
          },
        },
      ],
      schema: asSchema('network.xyo.manifest.package', true),
    }
    const wrapper = new ManifestWrapper(manifest, wallet, new ModuleFactoryLocator())
    const [node] = await wrapper.loadNodes()
    const state = await node.state()
    console.log(state)
  })
  it('create from manifest with module', async () => {
    const wallet = await HDWallet.random()
    const manifest: PackageManifestPayload = {
      nodes: [
        {
          config: {
            name: 'Node',
            schema: asSchema('network.xyo.node.config', true),
          },
          modules: {
            private: [
              {
                config: {
                  name: 'PrivateArchivist',
                  schema: asSchema('network.xyo.archivist.config', true),
                },
              },
            ],
            public: [
              {
                config: {
                  name: 'PublicArchivist',
                  schema: asSchema('network.xyo.archivist.config', true),
                },
              },
            ],
          },
        },
      ],
      schema: asSchema('network.xyo.manifest.package', true),
    }
    const wrapper = new ManifestWrapper(manifest, wallet, new ModuleFactoryLocator())
    const [node] = await wrapper.loadNodes()
    const state = await node.state()
    console.log(state)
  })
  it('create from manifest file', async () => {
    const wallet = await HDWallet.random()
    const manifestPath = Path.join(__dirname, 'manifest.json')
    const manifest: PackageManifestPayload = JSON.parse(await readFile(manifestPath, 'utf8'))
    const wrapper = new ManifestWrapper(manifest, wallet, new ModuleFactoryLocator())
    const [node] = await wrapper.loadNodes()
    const state = await node.state()
    console.log(state)
  })
})
