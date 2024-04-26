export interface RebillyUserEmailSettings {
  /**
   * Email associated with Rebilly account
   */
  email: string
}

export interface RebillyUserPasswordSettings extends RebillyUserEmailSettings {
  /**
   * Password associated with Rebilly account
   */
  password: string
}

export interface RebillyAuthSettings extends RebillyUserEmailSettings, RebillyUserPasswordSettings {}
