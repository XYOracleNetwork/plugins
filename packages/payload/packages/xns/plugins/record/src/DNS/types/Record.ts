/* eslint-disable @typescript-eslint/member-ordering */
import type { DNSResourceRecordTypeValue } from './ResourceRecord.ts'

export interface DNSRecord {
  name: string // The domain name that was queried
  type: DNSResourceRecordTypeValue // The record type (e.g., 1 for A record)
  TTL: number // Time to Live (how long the record can be cached)
  data: string // The actual data, such as an IP address or TXT record
}
