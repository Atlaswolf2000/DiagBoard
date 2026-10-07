import { Navigate } from 'react-router-dom'
import { LAB_DEVICES } from '@/config/devices'
import { ConnectionCard } from '@/components/workspace/ConnectionCard'
import { DualBoardPhotos } from '@/components/workspace/DualBoardPhotos'
import { SystemScanPanel } from '@/components/workspace/SystemScanPanel'
import { hasActiveIntake, getIntakeTicket } from '@/store/intakeStore'
import { formatTicketDate } from '@/lib/ticketDate'
import { useT } from '@/hooks/usePrefs'

export function WorkspacePage() {
  const t = useT()

  if (!hasActiveIntake()) {
    return <Navigate to="/intake" replace />
  }

  const ticket = getIntakeTicket()

  return (
    <div className="flex w-full flex-col gap-4 p-3">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-400/80">Workspace</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-50">{t('workspaceTitle')}</h2>
        {ticket ? (
          <p className="mt-2 text-sm text-slate-400">
            {ticket.customerName} — {ticket.deviceType}
            {ticket.laptopBrand ? ` — ${ticket.laptopBrand}` : ''}
            {ticket.serialNumber ? ` — ${ticket.serialNumber}` : ''} — {formatTicketDate(ticket.createdAt)}
          </p>
        ) : null}
      </div>

      <DualBoardPhotos />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {LAB_DEVICES.map((device) => (
          <ConnectionCard key={device.id} device={device} />
        ))}
      </div>

      <SystemScanPanel ticket={ticket} />
    </div>
  )
}
