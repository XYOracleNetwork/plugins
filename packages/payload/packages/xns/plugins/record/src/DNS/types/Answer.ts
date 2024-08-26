import type { DNSRecord } from './Record.ts'

export interface DNSAnswer extends DNSRecord {
  class?: number // The class (typically 1 for IN - Internet)
}
