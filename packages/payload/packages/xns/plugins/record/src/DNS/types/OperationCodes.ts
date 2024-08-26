export type DNSQueryOpcode = 0 | 1 | 2 | 4 | 5 | 6 // Supported opcodes as numeric values

// Optional: Add a more descriptive union type for the opcodes.
export type DNSQueryOpcodeName = 'QUERY' | 'IQUERY' | 'STATUS' | 'NOTIFY' | 'UPDATE' | 'DSO'

export const DNSQueryOpcodes: Record<DNSQueryOpcodeName, DNSQueryOpcode> = {
  QUERY: 0,
  IQUERY: 1,
  STATUS: 2,
  NOTIFY: 4,
  UPDATE: 5,
  DSO: 6,
}
