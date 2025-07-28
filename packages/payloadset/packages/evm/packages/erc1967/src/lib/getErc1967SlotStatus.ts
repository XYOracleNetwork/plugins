import type { Address, EthAddress } from '@xylabs/hex'
import {
  asEthAddress, hexFromHexString, isHexZero,
} from '@xylabs/hex'
import { UpgradeableBeacon__factory } from '@xyo-network/open-zeppelin-typechain'
import type { Provider } from 'ethers'

export const ERC1967_PROXY_IMPLEMENTATION_STORAGE_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc' as EthAddress
export const ERC1967_PROXY_BEACON_STORAGE_SLOT = '0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50' as EthAddress
export const ERC1967_PROXY_ADMIN_STORAGE_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103' as EthAddress
export const ERC1967_PROXY_ROLLBACK_STORAGE_SLOT = '0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143' as EthAddress

export interface Erc1967DataSlots {
  admin?: EthAddress
  beacon?: EthAddress
  implementation?: EthAddress
  rollback?: EthAddress
}

export interface Erc1967SlotStatus {
  address: string
  beacon?: {
    implementation?: Address
  }
  implementation: string
  slots: Erc1967DataSlots
}

const readAddressFromSlot = async (provider: Provider, address: string, slot: string, block?: number) => {
  try {
    const slotValue = await provider.getStorage(address, slot, block)
    return asEthAddress(hexFromHexString(slotValue, { prefix: true }))
  } catch {
    return
  }
}

export const getErc1967SlotStatus = async (provider: Provider, address: string, block?: number): Promise<Erc1967SlotStatus> => {
  const status: Erc1967SlotStatus = {
    address,
    implementation: address,
    slots: {
      admin: await readAddressFromSlot(provider, address, ERC1967_PROXY_ADMIN_STORAGE_SLOT, block),
      beacon: await readAddressFromSlot(provider, address, ERC1967_PROXY_BEACON_STORAGE_SLOT, block),
      implementation: await readAddressFromSlot(provider, address, ERC1967_PROXY_IMPLEMENTATION_STORAGE_SLOT, block),
      rollback: await readAddressFromSlot(provider, address, ERC1967_PROXY_ROLLBACK_STORAGE_SLOT, block),
    },
  }

  if (status.slots.implementation && !isHexZero(status.slots.implementation)) {
    status.implementation = `0x${BigInt(status.slots.implementation as string)
      .toString(16)
      .padStart(40, '0')}` as Address
  } else {
    if (status.slots.beacon && !isHexZero(status.slots.beacon)) {
      const beacon = UpgradeableBeacon__factory.connect(status.slots.beacon as string, { provider })
      try {
        const implementation = (await beacon.implementation(block ? { blockTag: block } : {})) as Address
        if (implementation) {
          status.beacon = { implementation }
          if (!isHexZero(implementation)) {
            status.implementation = implementation
          }
        }
      } catch (ex) {
        const error = ex as Error
        console.log(error.message)
      }
    }
  }

  return status
}
