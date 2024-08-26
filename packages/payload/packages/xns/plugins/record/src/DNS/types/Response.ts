import type { DNSAnswer } from './Answer.ts'
import type { DNSResponseHeader } from './Header.ts'
import type { DNSRecord } from './Record.ts'
import type { DNSQuestion } from './Request.ts'

/* eslint-disable @typescript-eslint/member-ordering */
export interface DNSResponseFields extends DNSResponseHeader {
  Question: DNSQuestion[] // The questions that were asked
  Answer: DNSAnswer[] // Reusing DNSAnswer for the Answer Section
  Authority?: DNSRecord[]
  Additional?: DNSRecord[]
}
