import type { AccountRow } from '@/types/accounts'
import { formatTicketDate, formatTicketTime } from '@/lib/ticketDate'
import { formatMoney, remainingAmount } from '@/lib/workshopDays'
import { useT } from '@/hooks/usePrefs'
import type { MessageKey } from '@/i18n/messages'

interface CompletionInvoiceProps {
  row: AccountRow
  issuedAt: string
}

function billedAmount(row: AccountRow): number {
  return row.newPrice > 0 ? row.newPrice : row.totalAmount
}

function legalKey(row: AccountRow): MessageKey {
  if (row.collectedAmount <= 0) return 'completionLegalFull'
  if (remainingAmount(row.totalAmount, row.collectedAmount, row.newPrice) <= 0) return 'completionLegalPaid'
  return 'completionLegalRemain'
}

export function CompletionInvoice({ row, issuedAt }: CompletionInvoiceProps) {
  const t = useT()
  const billed = billedAmount(row)
  const due = remainingAmount(row.totalAmount, row.collectedAmount, row.newPrice)

  return (
    <article id="completion-invoice" className="a5-sheet payout-sheet">
      <header className="a5-head">
        <div>
          <p className="a5-kicker">DiagBoard</p>
          <h1 className="a5-title">{t('completionInvoiceTitle')}</h1>
        </div>
        <div className="a5-ticket-no">
          <span>{t('completionInvoiceNo')}</span>
          <strong>{row.ticketNo}</strong>
        </div>
      </header>

      <div className="a5-grid">
        <label className="a5-cell">
          <span>{t('accCustomer')}</span>
          <strong>{row.customerName}</strong>
        </label>
        <label className="a5-cell a5-cell-locked">
          <span>{t('date')}</span>
          <strong>{`${formatTicketDate(issuedAt)} — ${formatTicketTime(issuedAt)}`}</strong>
        </label>
        <label className="a5-cell">
          <span>{t('accTotal')}</span>
          <strong dir="ltr">{formatMoney(billed)}</strong>
        </label>
        <label className="a5-cell">
          <span>{t('accCollected')}</span>
          <strong dir="ltr">{formatMoney(row.collectedAmount)}</strong>
        </label>
        <label className="a5-cell">
          <span>{t('completionDue')}</span>
          <strong dir="ltr">{formatMoney(due)}</strong>
        </label>
        <label className="a5-cell">
          <span>{t('accRemaining')}</span>
          <strong dir="ltr">{formatMoney(due)}</strong>
        </label>
        <label className="a5-cell a5-span-2">
          <span>{t('payoutInvoiceNote')}</span>
          <p className="text-sm leading-7 text-slate-700">{t(legalKey(row))}</p>
        </label>
      </div>

      <footer className="a5-foot">
        <div>
          <p>{t('customerSignInvoice')}</p>
          <span />
        </div>
        <div>
          <p>{t('cashierSign')}</p>
          <span />
        </div>
      </footer>
    </article>
  )
}
