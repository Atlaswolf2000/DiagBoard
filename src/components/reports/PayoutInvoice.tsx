import type { PartnerPayout } from '@/types/payouts'
import { formatTicketDate, formatTicketTime } from '@/lib/ticketDate'
import { formatMoney } from '@/lib/workshopDays'
import { useT } from '@/hooks/usePrefs'

interface PayoutInvoiceProps {
  payout: PartnerPayout
  partnerName: string
  remaining: number
}

export function PayoutInvoice({ payout, partnerName, remaining }: PayoutInvoiceProps) {
  const t = useT()

  return (
    <article id="payout-invoice" className="a5-sheet payout-sheet">
      <header className="a5-head">
        <div>
          <p className="a5-kicker">DiagBoard</p>
          <h1 className="a5-title">{t('payoutInvoiceTitle')}</h1>
        </div>
        <div className="a5-ticket-no">
          <span>{t('payoutInvoiceNo')}</span>
          <strong>{payout.id}</strong>
        </div>
      </header>

      <div className="a5-grid">
        <label className="a5-cell">
          <span>{t('partnerName')}</span>
          <strong>{partnerName}</strong>
        </label>
        <label className="a5-cell a5-cell-locked">
          <span>{t('payoutDate')}</span>
          <strong>{`${formatTicketDate(payout.createdAt)} — ${formatTicketTime(payout.createdAt)}`}</strong>
        </label>
        <label className="a5-cell">
          <span>{t('withdrawAmount')}</span>
          <strong dir="ltr">{formatMoney(payout.amount)}</strong>
        </label>
        <label className="a5-cell">
          <span>{t('partnerRemaining')}</span>
          <strong dir="ltr">{formatMoney(remaining)}</strong>
        </label>
        <label className="a5-cell a5-span-2">
          <span>{t('payoutInvoiceNote')}</span>
          <p className="text-sm leading-7 text-slate-700">{t('payoutInvoiceLegal')}</p>
        </label>
      </div>

      <footer className="a5-foot">
        <div>
          <p>{t('partnerSign')}</p>
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
