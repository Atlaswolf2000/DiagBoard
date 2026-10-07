import { useMemo, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Printer, Save } from 'lucide-react'
import { useAccounts } from '@/hooks/useAccounts'
import { usePayouts } from '@/hooks/usePayouts'
import { useT } from '@/hooks/usePrefs'
import { formatMoney } from '@/lib/workshopDays'
import { formatTicketDate, formatTicketTime, nowIso } from '@/lib/ticketDate'
import { parseAmount } from '@/lib/money'
import { addPartnerPayout, withdrawnFor } from '@/store/payoutsStore'
import { PayoutInvoice } from '@/components/reports/PayoutInvoice'
import type { PartnerId, PartnerPayout } from '@/types/payouts'
import { useExpenses } from '@/hooks/useExpenses'
import { totalNetProfit } from '@/lib/profit'

export function PayoutsPage() {
  const t = useT()
  const rows = useAccounts()
  const payouts = usePayouts()
  const expenses = useExpenses()
  const [partnerId, setPartnerId] = useState<PartnerId | ''>('')
  const [amount, setAmount] = useState('')
  const [createdAt, setCreatedAt] = useState(() => nowIso())
  const [visiblePayout, setVisiblePayout] = useState<PartnerPayout | null>(null)
  const [printPayout, setPrintPayout] = useState<PartnerPayout | null>(null)

  const totalProfit = useMemo(() => totalNetProfit(rows), [rows, expenses])
  const halfProfit = totalProfit / 2
  const names: Record<PartnerId, string> = {
    haidar: t('partnerHaidar'),
    adi: t('partnerAdi'),
  }
  const partners = (['haidar', 'adi'] as const).map((id) => {
    const due = halfProfit
    const received = withdrawnFor(id)
    return {
      id,
      name: names[id],
      share: '50%',
      due,
      received,
      remaining: Math.max(0, due - received),
    }
  })
  const remainingFor = (id: PartnerId) => partners.find((partner) => partner.id === id)?.remaining ?? 0
  const invoicePartner = visiblePayout
    ? partners.find((partner) => partner.id === visiblePayout.partnerId)
    : null

  const triggerPrint = (payout: PartnerPayout) => {
    setPrintPayout(payout)
    window.setTimeout(() => {
      window.print()
      window.setTimeout(() => setPrintPayout(null), 200)
    }, 80)
  }

  const savePayout = (event: FormEvent) => {
    event.preventDefault()
    if (!partnerId) return
    const value = parseAmount(amount)
    if (value <= 0) return
    addPartnerPayout(partnerId, value)
    setAmount('')
    setCreatedAt(nowIso())
    setVisiblePayout(null)
    setPrintPayout(null)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-start gap-3 print:hidden">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">{t('payoutsTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('payoutsHint')}</p>
        </div>
        <article className="rounded-xl border border-slate-800 bg-lab-900 px-5 py-4 shadow-panel">
          <p className="text-xs text-slate-500">{t('totalProfit')}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-emerald-300" dir="ltr">
            {formatMoney(totalProfit)}
          </p>
        </article>
        {partners.map((partner) => (
          <article key={partner.id} className="rounded-xl border border-slate-800 bg-lab-900 px-5 py-4 shadow-panel">
            <p className="text-xs text-slate-500">{partner.name} — {t('partnerRemaining')}</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-cyan-300" dir="ltr">
              {formatMoney(partner.remaining)}
            </p>
          </article>
        ))}
      </div>

      <form onSubmit={savePayout} className="grid gap-3 rounded-xl border border-slate-800 bg-lab-900 p-4 shadow-panel print:hidden md:grid-cols-4">
        <div className="md:col-span-4">
          <h3 className="text-sm font-semibold text-slate-100">{t('payoutCardTitle')}</h3>
        </div>
        <label className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-lab-850 px-3 py-2">
          <span className="text-[11px] text-slate-500">{t('partnerName')}</span>
          <select
            required
            value={partnerId}
            onChange={(event) => setPartnerId(event.target.value as PartnerId)}
            className="bg-transparent text-sm text-slate-100 outline-none"
          >
            <option value="" disabled>
              {t('choosePartner')}
            </option>
            <option value="haidar">{t('partnerHaidar')}</option>
            <option value="adi">{t('partnerAdi')}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-lab-850 px-3 py-2">
          <span className="text-[11px] text-slate-500">{t('payoutDate')}</span>
          <input
            readOnly
            value={`${formatTicketDate(createdAt)} — ${formatTicketTime(createdAt)}`}
            className="bg-transparent text-sm text-slate-100 outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-lab-850 px-3 py-2">
          <span className="text-[11px] text-slate-500">{t('withdrawAmount')}</span>
          <input
            required
            dir="ltr"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={t('iqdPlaceholder')}
            className="bg-transparent font-mono text-sm text-slate-100 outline-none"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-lab-950 hover:bg-cyan-400"
        >
          <Save className="h-4 w-4" />
          {t('savePayout')}
        </button>
      </form>

      {visiblePayout && invoicePartner ? (
        <div className="flex flex-col items-center gap-3 print:hidden">
          <PayoutInvoice
            payout={visiblePayout}
            partnerName={invoicePartner.name}
            remaining={remainingFor(visiblePayout.partnerId)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => triggerPrint(visiblePayout)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-lab-850 px-4 py-2.5 text-sm text-slate-200 hover:bg-lab-800"
            >
              <Printer className="h-4 w-4" />
              {t('printPayout')}
            </button>
            <button
              type="button"
              onClick={() => setVisiblePayout(null)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-lab-850 px-4 py-2.5 text-sm text-slate-200 hover:bg-lab-800"
            >
              <EyeOff className="h-4 w-4" />
              {t('hideInvoice')}
            </button>
          </div>
        </div>
      ) : null}

      {printPayout ? (
        <div className="print-only">
          <PayoutInvoice
            payout={printPayout}
            partnerName={names[printPayout.partnerId]}
            remaining={remainingFor(printPayout.partnerId)}
          />
        </div>
      ) : null}

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-lab-900 shadow-panel print:hidden">
        <div className="overflow-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="sticky top-0 bg-lab-850">
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3 text-center font-medium">{t('accSeq')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('partnerName')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('partnerShare')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('partnerAmount')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('partnerReceived')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('partnerRemaining')}</th>
              </tr>
            </thead>
            <tbody>
              {totalProfit === 0 && payouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-slate-500">
                    {t('noPayouts')}
                  </td>
                </tr>
              ) : (
                partners.map((partner, index) => (
                  <tr key={partner.id} className="border-b border-slate-800/80 text-slate-200">
                    <td className="px-4 py-3 text-center font-mono">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{partner.name}</td>
                    <td className="px-4 py-3 text-center font-mono">{partner.share}</td>
                    <td className="px-4 py-3 text-center font-mono" dir="ltr">
                      {formatMoney(partner.due)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-amber-300" dir="ltr">
                      {formatMoney(partner.received)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-emerald-300" dir="ltr">
                      {formatMoney(partner.remaining)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-800 bg-lab-900 shadow-panel print:hidden">
        <div className="border-b border-slate-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-100">{t('payoutHistory')}</h3>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead className="sticky top-0 bg-lab-850">
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3 text-center font-medium">{t('payoutInvoiceNo')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('partnerName')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('payoutDate')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('withdrawAmount')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('showInvoice')}</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                    {t('noPayouts')}
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-slate-800/80 text-slate-200">
                    <td className="px-4 py-3 text-center font-mono">{payout.id}</td>
                    <td className="px-4 py-3 text-center">{names[payout.partnerId]}</td>
                    <td className="px-4 py-3 text-center">
                      {`${formatTicketDate(payout.createdAt)} — ${formatTicketTime(payout.createdAt)}`}
                    </td>
                    <td className="px-4 py-3 text-center font-mono" dir="ltr">
                      {formatMoney(payout.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setVisiblePayout(visiblePayout?.id === payout.id ? null : payout)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-lab-850 px-3 py-1.5 text-xs text-slate-200 hover:bg-lab-800"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {visiblePayout?.id === payout.id ? t('hideInvoice') : t('showInvoice')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
