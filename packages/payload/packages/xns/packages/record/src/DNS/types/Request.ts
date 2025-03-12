/* eslint-disable @typescript-eslint/member-ordering */
import type { DNSRequestHeader } from './Header.ts'
import { StandardRequestHeader } from './Header.ts'
import type { DNSResourceRecordTypeValue } from './ResourceRecord.ts'
import { DNSResourceRecordTypes } from './ResourceRecord.ts'

export interface DNSQuestion {
  name: string // The domain name that was queried
  type: DNSResourceRecordTypeValue // The record type (e.g., 1 for A record)
  class?: number // Query Class (typically 1 for IN - Internet)
}

export interface DNSRequestFields extends DNSRequestHeader {
  Question: DNSQuestion[]
}

/**
 * Helper for generating a DNS request for a given domain and record type
 * @param domain The domain to query
 * @param type The record type to query
 * @returns A DNS request
 */
export const getRequestFor = (domain: string, type: DNSResourceRecordTypeValue = DNSResourceRecordTypes.A): DNSRequestFields => {
  return {
    ...StandardRequestHeader,
    ID: getRandomId(),
    Question: [{
      name: domain, type, class: 1,
    }],
  }
}

/**
 * Used to generate a random ID for a DNS request
 * @returns A random number between 0 and 65,535
 */
export const getRandomId = (): number => {
  return Math.floor(Math.random() * 65_536) // Math.random() generates a number between 0 and 1, multiply by 65536 to get the range 0-65535
}
