import type { MessageKey } from '@/i18n/messages'

export const USER_ROLES = ['مدير', 'فني', 'محاسب', 'مشاهد'] as const

export type UserRole = (typeof USER_ROLES)[number]

export const ROLE_KEYS: Record<UserRole, MessageKey> = {
  مدير: 'roleAdmin',
  فني: 'roleTech',
  محاسب: 'roleAccountant',
  مشاهد: 'roleViewer',
}

export const SYSTEM_SCREENS = [
  { id: 'intake', labelKey: 'navIntake' },
  { id: 'workspace', labelKey: 'navWorkspace' },
  { id: 'library', labelKey: 'navLibrary' },
  { id: 'accounts', labelKey: 'navAccounts' },
  { id: 'reports', labelKey: 'navReports' },
  { id: 'access', labelKey: 'navAccess' },
  { id: 'insights', labelKey: 'navInsights' },
] as const

export type ScreenId = (typeof SYSTEM_SCREENS)[number]['id']

export type ScreenAccess = Record<ScreenId, boolean>

export interface AccessUser {
  id: string
  displayName: string
  role: UserRole
  username: string
  password: string
  screens: ScreenAccess
}
