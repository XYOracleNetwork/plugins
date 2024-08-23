import type { Address } from '@xylabs/hex'
import { hexFromHexString, isHexZero } from '@xylabs/hex'
import type { Provider } from 'ethers'

export const ERC1822_PROXY_LOGIC_SLOT = '0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7'

export interface Erc1822DataSlots {
  implementation?: Address
}

export interface Erc1822SlotStatus {
  address: string
  implementation: string
  slots: Erc1822DataSlots
}

const readAddressFromSlot = async (provider: Provider, address: string, slot: string, block?: number) => {
  try {
    const slotValue = await provider.getStorage(address, slot, block)
    return hexFromHexString(slotValue, { prefix: true })
  } catch {
    return
  }
}

export const getErc1822SlotStatus = async (provider: Provider, address: string, block?: number): Promise<Erc1822SlotStatus> => {
  const status: Erc1822SlotStatus = {
    address,
    implementation: address,
    slots: { implementation: await readAddressFromSlot(provider, address, ERC1822_PROXY_LOGIC_SLOT, block) },
  }

  if (status.slots.implementation && !isHexZero(status.slots.implementation)) {
    status.implementation = status.slots.implementation
  }

  return status
}
