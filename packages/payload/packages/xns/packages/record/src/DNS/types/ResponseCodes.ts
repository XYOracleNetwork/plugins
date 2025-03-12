export type DNSRcode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 16 | 17 | 18

export type DNSRcodeName =
  | 'NOERROR'
  | 'FORMERR'
  | 'SERVFAIL'
  | 'NXDOMAIN'
  | 'NOTIMP'
  | 'REFUSED'
  | 'YXDOMAIN'
  | 'YXRRSET'
  | 'NXRRSET'
  | 'NOTAUTH'
  | 'NOTZONE'
  | 'BADSIG'
  | 'BADKEY'
  | 'BADTIME'

export const DNSRcodes: Readonly<Record<DNSRcodeName, DNSRcode>> = {
  NOERROR: 0,
  FORMERR: 1,
  SERVFAIL: 2,
  NXDOMAIN: 3,
  NOTIMP: 4,
  REFUSED: 5,
  YXDOMAIN: 6,
  YXRRSET: 7,
  NXRRSET: 8,
  NOTAUTH: 9,
  NOTZONE: 10,
  BADSIG: 16,
  BADKEY: 17,
  BADTIME: 18,
}
