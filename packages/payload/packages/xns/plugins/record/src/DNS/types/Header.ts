/* eslint-disable @typescript-eslint/member-ordering */

// An attempt to match compatibility with the RFC 8427 (Representing DNS Messages in JSON)
// https://www.rfc-editor.org/rfc/rfc8427
// and Google/CloudFlare's DNS over HTTPS (DoH) standard
// https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/

import { DNSQueryOpcode, DNSQueryOpcodes } from './OperationCodes.ts'
import { DNSRcode, DNSRcodes } from './ResponseCodes.ts'

// NOTE: The RFC says `Boolean` but uses 0/1 for the values. DNS over HTTPS (DoH) uses `true`/`false`.
export type NumericBoolean = 0 | 1 | true | false
export type NumericBooleanFalsy = 0 | false
export type NumericBooleanTruthy = 1 | true

export interface DNSHeader {
  /**
   * Transaction ID, typically a random number. Integer whose value is 0 to 65535
   */
  ID?: number
  /**
   * Query/Response Flag (0 = Query, 1 = Response)
   */
  QR?: NumericBoolean
  /**
   * Operation Code (0 for standard query)
   */
  Opcode?: DNSQueryOpcode
  /**
   * Authoritative Answer (set in response)
   */
  AA?: NumericBoolean
  /**
   * Truncated Flag
   */
  TC?: NumericBoolean // Truncation
  /**
   * Recursion Desired
   */
  RD?: NumericBoolean // Recursion Desired (set in query)
  /**
   * Response Code (0 for no error, non-0 for errors)
   */
  RCODE?: DNSRcode
  /**
   * Number of questions in the query (usually 1)
   */
  QDCOUNT?: number
  /**
   * Number of answer records in the response
   */
  ANCOUNT?: number
  /**
   * Number of authority records in the response
   */
  NSCOUNT?: number
  /**
   * Number of additional records in the response
   */
  ARCOUNT?: number
}

export interface DNSRequestHeader extends DNSHeader {
  QR: NumericBooleanFalsy // Query/Response Flag (0 = Query)
  Opcode: DNSQueryOpcode // Operation Code (0 for standard query)
  AA: NumericBooleanFalsy // Authoritative Answer (0 in query)
  TC: NumericBooleanFalsy // Truncation (0 for non-truncated)
  RCODE: typeof DNSRcodes.NOERROR // Response Code (always 0 in query)
  ANCOUNT: 0 // Number of answer records (always 0 in query)
  NSCOUNT: 0 // Number of authority records (always 0 in query)
  ARCOUNT: 0 // Number of additional records (always 0 in query)
}

export const StandardRequestHeader: Readonly<DNSRequestHeader> = {
  ID: 0,
  QR: 0, // Query/Response Flag (0 = Query)
  Opcode: DNSQueryOpcodes.QUERY, // Operation Code (0 for standard query)
  AA: 0, // Authoritative Answer (0 in query)
  TC: 0, // Truncation (0 for non-truncated)
  RD: 1, // Recursion Desired (1 if recursion is requested)
  RCODE: DNSRcodes.NOERROR, // Response Code (always 0 in query)
  QDCOUNT: 1,
  ANCOUNT: 0,
  NSCOUNT: 0,
  ARCOUNT: 0,
}

export interface DNSResponseHeader extends DNSHeader {
  QR: NumericBooleanTruthy // Query/Response Flag (1 = Response)
  Opcode: DNSQueryOpcode // Operation Code (0 for standard query)
  AA: NumericBoolean // Authoritative Answer (1 if the response is authoritative)
  TC: NumericBoolean // Truncation (1 if the message is truncated)
  RA: NumericBoolean // Recursion Available (1 if the server supports recursion)
}
