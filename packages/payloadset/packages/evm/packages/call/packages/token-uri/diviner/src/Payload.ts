// eslint-disable-next-line workspaces/no-absolute-imports
import type { EvmCallResults } from '@xyo-network/evm-call-witness'

export type EvmTokenUriCallResults = EvmCallResults & { results: { tokenURI: { args: [string]; result?: string } } }
