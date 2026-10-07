import { Navigate, Route, Routes } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { IntakePage } from '@/pages/intake/IntakePage'
import { WorkspacePage } from '@/pages/workspace/WorkspacePage'
import { LibraryPage } from '@/pages/library/LibraryPage'
import { AccountsPage } from '@/pages/accounts/AccountsPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { ProfitsPage } from '@/pages/reports/ProfitsPage'
import { CashboxPage } from '@/pages/reports/CashboxPage'
import { PayoutsPage } from '@/pages/reports/PayoutsPage'
import { AccessPage } from '@/pages/access/AccessPage'
import { InsightsPage } from '@/pages/insights/InsightsPage'
import { useLocale, useTheme } from '@/hooks/usePrefs'

export function AppShell() {
  useTheme()
  useLocale()

  return (
    <div className="flex h-full min-h-0 bg-lab-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/intake" replace />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/profits" element={<ProfitsPage />} />
            <Route path="/reports/cashbox" element={<CashboxPage />} />
            <Route path="/reports/payouts" element={<PayoutsPage />} />
            <Route path="/access" element={<AccessPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
