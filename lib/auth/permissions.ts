import { Role, type Permission } from '@/types/roles'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.Farmer]: [
    'marketplace:read',
    'marketplace:write',
    'financing:read',
    'financing:apply',
  ],
  [Role.Trader]: [
    'marketplace:read',
    'marketplace:write',
    'analytics:read',
    'financing:read',
    'financing:apply',
  ],
  [Role.NGO]: [
    'marketplace:read',
    'analytics:read',
    'ngo:access',
    'financing:read',
  ],
  [Role.Government]: [
    'marketplace:read',
    'analytics:read',
    'analytics:admin',
    'government:access',
    'satellite:read',
  ],
  [Role.Admin]: ['admin:all'],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === Role.Admin) return true
  return ROLE_PERMISSIONS[role].includes(permission)
}
