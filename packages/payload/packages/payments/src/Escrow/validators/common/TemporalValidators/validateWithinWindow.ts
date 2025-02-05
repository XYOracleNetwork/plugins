export type Windowed = { exp?: number; nbf?: number }

export const validateWithinWindow = (value: Windowed, exp: number, nbf: number = Date.now()): boolean => {
  if (value.nbf === undefined || value.nbf > nbf) return false
  return !(value.exp === undefined || value.exp < exp)
}
