import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { HDWallet } from '@xyo-network/account'
import { PackageManifestPayload } from '@xyo-network/manifest'
import { ManifestWrapper } from '@xyo-network/manifest-wrapper'
import { MemoryNode } from '@xyo-network/node-memory'

describe('Node', () => {
  it('create', async () => {
    const node = await MemoryNode.create()
    const describe = await node.describe()
    console.log(describe)
  })
  it('create from manifest', async () => {
    const wallet = await HDWallet.random()
    const manifest: PackageManifestPayload = {
      nodes: [
        {
          config: {
            name: 'Node',
            schema: 'network.xyo.node.config',
          },
          modules: {
            private: [],
            public: [],
          },
        },
      ],
      schema: 'network.xyo.manifest.package',
    }
    const wrapper = new ManifestWrapper(manifest, wallet)
    const [node] = await wrapper.loadNodes()
    const describe = await node.describe()
    console.log(describe)
  })
  it('create from manifest with module', async () => {
    const wallet = await HDWallet.random()
    const manifest: PackageManifestPayload = {
      nodes: [
        {
          config: {
            name: 'Node',
            schema: 'network.xyo.node.config',
          },
          modules: {
            private: [
              {
                config: {
                  name: 'PrivateArchivist',
                  schema: 'network.xyo.archivist.config',
                },
              },
            ],
            public: [
              {
                config: {
                  name: 'PublicArchivist',
                  schema: 'network.xyo.archivist.config',
                },
              },
            ],
          },
        },
      ],
      schema: 'network.xyo.manifest.package',
    }
    const wrapper = new ManifestWrapper(manifest, wallet)
    const [node] = await wrapper.loadNodes()
    const describe = await node.describe()
    console.log(describe)
  })
  it('create from manifest file', async () => {
    const wallet = await HDWallet.random()
    const manifestPath = join(__dirname, 'manifest.json')
    const manifest: PackageManifestPayload = JSON.parse(await readFile(manifestPath, 'utf8'))
    const wrapper = new ManifestWrapper(manifest, wallet)
    const [node] = await wrapper.loadNodes()
    const describe = await node.describe()
    console.log(describe)
  })
})
