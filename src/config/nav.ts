import type { LucideIcon } from 'lucide-react'
import {
  ClipboardList,
  Cpu,
  FolderOpen,
  Users,
  FileBarChart,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
  Handshake,
} from 'lucide-react'
import type { MessageKey } from '@/i18n/messages'
import type { AppRoute } from '@/types/navigation'

export interface NavChild {
  id: string
  labelKey: MessageKey
  path: AppRoute
  icon: LucideIcon
  hint: string
}

export interface NavItem {
  id: string
  labelKey: MessageKey
  path: AppRoute
  icon: LucideIcon
  hint: string
  children?: NavChild[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'intake',
    labelKey: 'navIntake',
    path: '/intake',
    icon: ClipboardList,
    hint: 'A5 Intake Card',
  },
  {
    id: 'workspace',
    labelKey: 'navWorkspace',
    path: '/workspace',
    icon: Cpu,
    hint: 'Workspace',
  },
  {
    id: 'library',
    labelKey: 'navLibrary',
    path: '/library',
    icon: FolderOpen,
    hint: 'Library & DB',
  },
  {
    id: 'accounts',
    labelKey: 'navAccounts',
    path: '/accounts',
    icon: Users,
    hint: 'Accounts',
  },
  {
    id: 'reports',
    labelKey: 'navReports',
    path: '/reports',
    icon: FileBarChart,
    hint: 'Reports',
    children: [
      {
        id: 'profits',
        labelKey: 'navProfits',
        path: '/reports/profits',
        icon: TrendingUp,
        hint: 'Profits',
      },
      {
        id: 'cashbox',
        labelKey: 'navCashbox',
        path: '/reports/cashbox',
        icon: Wallet,
        hint: 'Cashbox',
      },
      {
        id: 'payouts',
        labelKey: 'navPayouts',
        path: '/reports/payouts',
        icon: Handshake,
        hint: 'Partner payouts',
      },
    ],
  },
  {
    id: 'access',
    labelKey: 'navAccess',
    path: '/access',
    icon: Shield,
    hint: 'Access Control',
  },
  {
    id: 'insights',
    labelKey: 'navInsights',
    path: '/insights',
    icon: Sparkles,
    hint: 'Claude Insights',
  },
]

export function findNavMatch(pathname: string): NavItem | NavChild | undefined {
  for (const item of NAV_ITEMS) {
    if (item.path === pathname) return item
    const child = item.children?.find((entry) => entry.path === pathname)
    if (child) return child
  }
  return undefined
}
