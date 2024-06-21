/**
 * Interface representing an object with a string data field
 */
export interface StringDataField {
  /**
   * The string data
   */
  data: string
}

/**
 * Identity for StringDataField
 * @param obj The input object
 * @returns True if the object is a StringDataField, false otherwise
 */
export const hasStringDataField = (obj?: unknown): obj is StringDataField => {
  return typeof obj === 'object' && obj !== null && 'data' in obj && typeof (obj as StringDataField)?.data === 'string'
}
