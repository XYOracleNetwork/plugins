export interface DurationFields {
  /**
   * A timestamp that indicates the expiration time of the record
   */
  exp: number

  /**
   * A timestamp that indicates the time before which the record is not valid
   */
  nbf: number
}
