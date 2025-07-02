// https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4

export type DNSResourceRecordType
  = | 'A'
    | 'NS'
    | 'MD'
    | 'MF'
    | 'CNAME'
    | 'SOA'
    | 'MB'
    | 'MG'
    | 'MR'
    | 'NULL'
    | 'WKS'
    | 'PTR'
    | 'HINFO'
    | 'MINFO'
    | 'MX'
    | 'TXT'
    | 'RP'
    | 'AFSDB'
    | 'X25'
    | 'ISDN'
    | 'RT'
    | 'NSAP'
    | 'NSAP-PTR'
    | 'SIG'
    | 'KEY'
    | 'PX'
    | 'GPOS'
    | 'AAAA'
    | 'LOC'
    | 'NXT'
    | 'EID'
    | 'NIMLOC'
    | 'SRV'
    | 'ATMA'
    | 'NAPTR'
    | 'KX'
    | 'CERT'
    | 'A6'
    | 'DNAME'
    | 'SINK'
    | 'OPT'
    | 'APL'
    | 'DS'
    | 'SSHFP'
    | 'IPSECKEY'
    | 'RRSIG'
    | 'NSEC'
    | 'DNSKEY'
    | 'DHCID'
    | 'NSEC3'
    | 'NSEC3PARAM'
    | 'TLSA'
    | 'SMIMEA'
    | 'HIP'
    | 'NINFO'
    | 'RKEY'
    | 'TALINK'
    | 'CDS'
    | 'CDNSKEY'
    | 'OPENPGPKEY'
    | 'CSYNC'
    | 'ZONEMD'
    | 'SVCB'
    | 'HTTPS'
    | 'SPF'
    | 'UINFO'
    | 'UID'
    | 'GID'
    | 'UNSPEC'
    | 'NID'
    | 'L32'
    | 'L64'
    | 'LP'
    | 'EUI48'
    | 'EUI64'
    | 'NXNAME'
    | 'TKEY'
    | 'TSIG'
    | 'IXFR'
    | 'AXFR'
    | 'MAILB'
    | 'MAILA'
    | '*'
    | 'URI'
    | 'CAA'
    | 'AVC'
    | 'DOA'
    | 'AMTRELAY'
    | 'RESINFO'
    | 'WALLET'
    | 'CLA'
    | 'IPN'
    | 'TA'
    | 'DLV'
  // NOTE: Custom types here
    | 'XYOA'
    | 'XYOH'

export const DNSResourceRecordTypes: Readonly<Record<DNSResourceRecordType, number>> = {
  'A': 1, // a host address
  'NS': 2, // an authoritative name server
  'MD': 3, // a mail destination (OBSOLETE - use MX)
  'MF': 4, // a mail forwarder (OBSOLETE - use MX)
  'CNAME': 5, // the canonical name for an alias
  'SOA': 6, // marks the start of a zone of authority
  'MB': 7, // a mailbox domain name (EXPERIMENTAL)
  'MG': 8, // a mail group member (EXPERIMENTAL)
  'MR': 9, // a mail rename domain name (EXPERIMENTAL)
  'NULL': 10, // a null RR (EXPERIMENTAL)
  'WKS': 11, // a well known service description
  'PTR': 12, // a domain name pointer
  'HINFO': 13, // host information
  'MINFO': 14, // mailbox or mail list information
  'MX': 15, // mail exchange
  'TXT': 16, // text strings
  'RP': 17, // for Responsible Person
  'AFSDB': 18, // for AFS Data Base location
  'X25': 19, // for X.25 PSDN address
  'ISDN': 20, // for ISDN address
  'RT': 21, // for Route Through
  'NSAP': 22, // for NSAP address, NSAP style A record (DEPRECATED)
  'NSAP-PTR': 23, // for domain name pointer, NSAP style (DEPRECATED)
  'SIG': 24, // for security signature
  'KEY': 25, // for security key
  'PX': 26, // X.400 mail mapping information
  'GPOS': 27, // Geographical Position
  'AAAA': 28, // IP6 Address
  'LOC': 29, // Location Information
  'NXT': 30, // Next Domain (OBSOLETE)
  'EID': 31, // Endpoint Identifier
  'NIMLOC': 32, // Nimrod Locator
  'SRV': 33, // Server Selection
  'ATMA': 34, // ATM Address
  'NAPTR': 35, // Naming Authority Pointer
  'KX': 36, // Key Exchanger
  'CERT': 37, // CERT
  'A6': 38, // A6 (OBSOLETE - use AAAA)
  'DNAME': 39, // DNAME
  'SINK': 40, // SINK
  'OPT': 41, // OPT
  'APL': 42, // APL
  'DS': 43, // Delegation Signer
  'SSHFP': 44, // SSH Key Fingerprint
  'IPSECKEY': 45, // IPSECKEY
  'RRSIG': 46, // RRSIG
  'NSEC': 47, // NSEC
  'DNSKEY': 48, // DNSKEY
  'DHCID': 49, // DHCID
  'NSEC3': 50, // NSEC3
  'NSEC3PARAM': 51, // NSEC3PARAM
  'TLSA': 52, // TLSA
  'SMIMEA': 53, // S/MIME cert association
  'HIP': 55, // Host Identity Protocol
  'NINFO': 56, // NINFO
  'RKEY': 57, // RKEY
  'TALINK': 58, // Trust Anchor LINK
  'CDS': 59, // Child DS
  'CDNSKEY': 60, // DNSKEY(s) the Child wants reflected in DS
  'OPENPGPKEY': 61, // OpenPGP Key
  'CSYNC': 62, // Child-To-Parent Synchronization
  'ZONEMD': 63, // Message Digest Over Zone Data
  'SVCB': 64, // General-purpose service binding
  'HTTPS': 65, // SVCB-compatible type for use with HTTP
  'SPF': 99,
  'UINFO': 100,
  'UID': 101,
  'GID': 102,
  'UNSPEC': 103,
  'NID': 104,
  'L32': 105,
  'L64': 106,
  'LP': 107,
  'EUI48': 108, // an EUI-48 address
  'EUI64': 109, // an EUI-64 address
  'NXNAME': 128, // NXDOMAIN indicator for Compact Denial of Existence
  'TKEY': 249, // Transaction Key
  'TSIG': 250, // Transaction Signature
  'IXFR': 251, // incremental transfer
  'AXFR': 252, // transfer of an entire zone
  'MAILB': 253, // mailbox-related RRs (MB, MG or MR)
  'MAILA': 254, // mail agent RRs (OBSOLETE - see MX)
  '*': 255, // A request for some or all records the server has available
  'URI': 256, // URI
  'CAA': 257, // Certification Authority Restriction
  'AVC': 258, // Application Visibility and Control
  'DOA': 259, // Digital Object Architecture
  'AMTRELAY': 260, // Automatic Multicast Tunneling Relay
  'RESINFO': 261, // Resolver Information as Key/Value Pairs
  'WALLET': 262, // Public wallet address
  'CLA': 263, // BP Convergence Layer Adapter
  'IPN': 264, // BP Node Number
  'TA': 32_768, // DNSSEC Trust Authorities
  'DLV': 32_769, // DNSSEC Lookaside Validation (OBSOLETE)

  // NOTE: Custom types here chosen within the Private Use Range
  // https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4
  // https://www.rfc-editor.org/rfc/rfc5226
  // as, per the RFC, the Private Use Range is reserved
  // "For private or local use only, with the type and
  // purpose defined by the local site.  No attempt is made to
  // prevent multiple sites from using the same value in
  // different (and incompatible) ways.  There is no need for
  // IANA to review such assignments (since IANA does not record
  // them) and assignments are not generally useful for broad
  // interoperability.  It is the responsibility of the sites
  // making use of the Private Use range to ensure that no
  // conflicts occur (within the intended scope of use)."
  // If we want to apply for a custom reserved code later
  // on, once the usage is proven enough we can absolutely
  // do that.
  'XYOA': 65_432, // XYO Address
  'XYOH': 65_433, // XYO Hash
}

export type DNSResourceRecordTypeValue = (typeof DNSResourceRecordTypes)[keyof typeof DNSResourceRecordTypes]

export const findDNSResourceRecordTypesByValue = (value: DNSResourceRecordTypeValue): DNSResourceRecordType | undefined => {
  // Iterate through the keys of the record
  for (const key in DNSResourceRecordTypes) {
    const resourceRecordType = key as DNSResourceRecordType
    if (DNSResourceRecordTypes[resourceRecordType] === value) {
      return resourceRecordType // Return the key if the value matches
    }
  }
  return undefined // Return undefined if no matching value is found
}
