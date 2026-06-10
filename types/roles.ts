export enum Role {
  Farmer = 'farmer',
  Trader = 'trader',
  NGO = 'ngo',
  Government = 'government',
  Admin = 'admin',
}

export type Permission =
  | 'marketplace:read'
  | 'marketplace:write'
  | 'analytics:read'
  | 'analytics:admin'
  | 'financing:read'
  | 'financing:apply'
  | 'financing:approve'
  | 'ngo:access'
  | 'government:access'
  | 'satellite:read'
  | 'admin:all'

export interface UserWithRole {
  id: string
  email: string
  role: Role
  permissions: Permission[]
}
