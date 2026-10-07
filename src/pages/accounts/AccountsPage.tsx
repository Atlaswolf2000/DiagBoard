import { useMemo, useState } from 'react'
import { Eye, EyeOff, Printer, Receipt, Search, Wallet } from 'lucide-react'
import { ACCOUNT_STATUSES, type AccountRow, type AccountStatus } from '@/types/accounts'
import { formatMoney, formatShortDate, remainingAmount, workshopDays } from '@/lib/workshopDays'
import { matchesQuery } from '@/lib/smartSearch'
import { useT } from '@/hooks/usePrefs'
import type { MessageKey } from '@/i18n/messages'
import { useAccounts } from '@/hooks/useAccounts'
import { collectRemaining, updateAccountPrice, updateAccountStatus } from '@/store/accountsStore'
import { CompletionInvoice } from '@/components/accounts/CompletionInvoice'
import { ExpenseModal } from '@/components/accounts/ExpenseModal'
import { nowIso } from '@/lib/ticketDate'
import { useExpenses } from '@/hooks/useExpenses'
import { expenseTotalFor } from '@/store/expensesStore'

const STATUS_TONE: Record<AccountStatus, string> = {
  'قيد الفحص': 'bg-cyan-500/10 text-cyan-300',
  أنجزت: 'bg-amber-500/10 text-amber-300',
  'تم التسليم': 'bg-emerald-500/10 text-emerald-300',
  'تم الإرجاع': 'bg-rose-500/10 text-rose-300',
}

const STATUS_KEYS: Record<AccountStatus, MessageKey> = {
  'قيد الفحص': 'statusInspecting',
  أنجزت: 'statusCompleted',
  'تم التسليم': 'statusDelivered',
  'تم الإرجاع': 'statusReturned',
}

export function AccountsPage() {
  const t = useT()
  const rows = useAccounts()
  const [query, setQuery] = useState('')
  const [visibleRow, setVisibleRow] = useState<AccountRow | null>(null)
  const [printRow, setPrintRow] = useState<AccountRow | null>(null)
  const [issuedAt, setIssuedAt] = useState(() => nowIso())
  const [expenseRow, setExpenseRow] = useState<AccountRow | null>(null)
  const expenses = useExpenses()
  const columns: MessageKey[] = [
    'accSeq',
    'accCustomer',
    'accTotal',
    'accNewPrice',
    'accCollected',
    'accRemaining',
    'accEntry',
    'accExit',
    'accDays',
    'accStatus',
    'accNotes',
  ]

  const filtered = useMemo(
    () =>
      rows.filter((row, index) => {
        const remaining = remainingAmount(row.totalAmount, row.collectedAmount, row.newPrice)
        const days = workshopDays(row.entryDate, row.exitDate)
        return matchesQuery(
          [
            index + 1,
            row.ticketNo,
            row.customerName,
            row.totalAmount,
            formatMoney(row.totalAmount),
            row.newPrice,
            formatMoney(row.newPrice),
            row.collectedAmount,
            formatMoney(row.collectedAmount),
            remaining,
            formatMoney(remaining),
            formatShortDate(row.entryDate),
            formatShortDate(row.exitDate),
            days,
            row.status,
            row.notes,
            expenseTotalFor(row.ticketNo),
          ],
          query,
        )
      }),
    [query, rows, expenses],
  )

  const triggerPrint = (row: AccountRow) => {
    setPrintRow(row)
    window.setTimeout(() => {
      window.print()
      window.setTimeout(() => setPrintRow(null), 200)
    }, 80)
  }

  const changeStatus = (row: AccountRow, status: AccountStatus) => {
    updateAccountStatus(row.ticketNo, status)
    if (status === 'أنجزت') {
      const stamp = nowIso()
      setIssuedAt(stamp)
      setVisibleRow({ ...row, status })
      return
    }
    if (visibleRow?.ticketNo === row.ticketNo) setVisibleRow(null)
  }

  const collectDue = (row: AccountRow) => {
    const next = collectRemaining(row.ticketNo)
    if (next) setVisibleRow(next)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {visibleRow ? (
        <div className="flex flex-col items-center gap-3 print:hidden">
          <CompletionInvoice row={visibleRow} issuedAt={issuedAt} />
          <div className="flex flex-wrap items-center gap-2">
            {remainingAmount(visibleRow.totalAmount, visibleRow.collectedAmount, visibleRow.newPrice) > 0 ? (
              <button
                type="button"
                onClick={() => collectDue(visibleRow)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-lab-950 hover:bg-cyan-400"
              >
                <Wallet className="h-4 w-4" />
                {t('collectRemaining')}
              </button>
            ) : (
              <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">
                {t('remainingPosted')}
              </span>
            )}
            <button
              type="button"
              onClick={() => triggerPrint(visibleRow)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-lab-850 px-4 py-2.5 text-sm text-slate-200 hover:bg-lab-800"
            >
              <Printer className="h-4 w-4" />
              {t('printCompletion')}
            </button>
            <button
              type="button"
              onClick={() => setVisibleRow(null)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-lab-850 px-4 py-2.5 text-sm text-slate-200 hover:bg-lab-800"
            >
              <EyeOff className="h-4 w-4" />
              {t('hideCompletionInvoice')}
            </button>
          </div>
        </div>
      ) : null}

      {printRow ? (
        <div className="print-only">
          <CompletionInvoice row={printRow} issuedAt={issuedAt} />
        </div>
      ) : null}

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-lab-900 shadow-panel print:hidden">
        <div className="flex justify-start border-b border-slate-800 p-3">
          <label className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('accountsSearch')}
              className="w-full rounded-lg border border-slate-800 bg-lab-850 py-2 ps-10 pe-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500/60"
            />
          </label>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead className="sticky top-0 bg-lab-850">
              <tr className="border-b border-slate-800 text-slate-400">
                {columns.map((column) => (
                  <th key={column} className="whitespace-nowrap px-4 py-3 text-start font-medium">
                    {t(column)}
                  </th>
                ))}
                <th className="whitespace-nowrap px-4 py-3 text-start font-medium">{t('expenseTotal')}</th>
                <th className="whitespace-nowrap px-4 py-3 text-start font-medium">{t('addExpense')}</th>
                <th className="whitespace-nowrap px-4 py-3 text-start font-medium">{t('showCompletionInvoice')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 3} className="px-4 py-16 text-center text-slate-500">
                    {query.trim() ? t('noMatches') : t('noAccounts')}
                  </td>
                </tr>
              ) : (
                filtered.map((row, index) => {
                  const remaining = remainingAmount(row.totalAmount, row.collectedAmount, row.newPrice)
                  const days = workshopDays(row.entryDate, row.exitDate)
                  const open = visibleRow?.ticketNo === row.ticketNo
                  return (
                    <tr key={row.id} className="border-b border-slate-800/80 text-slate-200">
                      <td className="px-4 py-3 font-mono">{index + 1}</td>
                      <td className="px-4 py-3">{row.customerName}</td>
                      <td className="px-4 py-3 font-mono" dir="ltr">
                        {formatMoney(row.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          dir="ltr"
                          inputMode="decimal"
                          value={row.newPrice || ''}
                          onChange={(event) => updateAccountPrice(row.ticketNo, Number(event.target.value.replace(/[^\d.]/g, '')) || 0)}
                          placeholder={t('iqdPlaceholder')}
                          className="w-28 rounded border border-slate-800 bg-lab-850 px-2 py-1 font-mono text-sm text-slate-100 outline-none focus:border-cyan-500/60"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono" dir="ltr">
                        {formatMoney(row.collectedAmount)}
                      </td>
                      <td className="px-4 py-3 font-mono" dir="ltr">
                        {formatMoney(remaining)}
                      </td>
                      <td className="px-4 py-3">{formatShortDate(row.entryDate)}</td>
                      <td className="px-4 py-3">{formatShortDate(row.exitDate)}</td>
                      <td className="px-4 py-3 font-mono">{days}</td>
                      <td className="px-4 py-3">
                        <select
                          value={row.status}
                          onChange={(event) => changeStatus(row, event.target.value as AccountStatus)}
                          className={`rounded-full border-0 px-2.5 py-1 text-xs outline-none ${STATUS_TONE[row.status]}`}
                        >
                          {ACCOUNT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {t(STATUS_KEYS[status])}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-slate-400">{row.notes || '—'}</td>
                      <td className="px-4 py-3 font-mono text-amber-300" dir="ltr">
                        {formatMoney(expenseTotalFor(row.ticketNo))}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setExpenseRow(row)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-lab-850 px-3 py-1.5 text-xs text-slate-200 hover:bg-lab-800"
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          {t('addExpense')}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {row.status === 'أنجزت' || row.status === 'تم التسليم' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIssuedAt(nowIso())
                              setVisibleRow(open ? null : row)
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-lab-850 px-3 py-1.5 text-xs text-slate-200 hover:bg-lab-800"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {open ? t('hideCompletionInvoice') : t('showCompletionInvoice')}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {expenseRow ? <ExpenseModal row={expenseRow} onClose={() => setExpenseRow(null)} /> : null}
    </div>
  )
}
