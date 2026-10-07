import { useMemo } from 'react'
import { useAccounts } from '@/hooks/useAccounts'
import { useExpenses } from '@/hooks/useExpenses'
import { useT } from '@/hooks/usePrefs'
import { formatMoney } from '@/lib/workshopDays'
import { profitForRow } from '@/lib/profit'

export function ProfitsPage() {
  const t = useT()
  const rows = useAccounts()
  const expenses = useExpenses()

  const items = useMemo(
    () =>
      rows.map((row) => {
        const calc = profitForRow(row)
        return { ...row, expenses: calc.expenses, profit: calc.profit, counted: calc.counted }
      }),
    [rows, expenses],
  )

  const totalProfit = items.reduce((sum, row) => sum + row.profit, 0)
  const halfProfit = totalProfit / 2

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-start gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">{t('profitsTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('profitsHint')}</p>
        </div>
        <article className="rounded-xl border border-slate-800 bg-lab-900 px-5 py-4 shadow-panel">
          <p className="text-xs text-slate-500">{t('totalProfit')}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-emerald-300" dir="ltr">
            {formatMoney(totalProfit)}
          </p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-lab-900 px-5 py-4 shadow-panel">
          <p className="text-xs text-slate-500">{t('haidarProfit')}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-cyan-300" dir="ltr">
            {formatMoney(halfProfit)}
          </p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-lab-900 px-5 py-4 shadow-panel">
          <p className="text-xs text-slate-500">{t('adiProfit')}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-cyan-300" dir="ltr">
            {formatMoney(halfProfit)}
          </p>
        </article>
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-lab-900 shadow-panel">
        <div className="overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="sticky top-0 bg-lab-850">
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-3 text-center font-medium">{t('accSeq')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('accCustomer')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('accTotal')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('expenseTotal')}</th>
                <th className="px-4 py-3 text-center font-medium">{t('profitAmount')}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                    {t('noProfits')}
                  </td>
                </tr>
              ) : (
                items.map((row, index) => (
                  <tr key={row.id} className="border-b border-slate-800/80 text-slate-200">
                    <td className="px-4 py-3 text-center font-mono">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{row.customerName}</td>
                    <td className="px-4 py-3 text-center font-mono" dir="ltr">
                      {formatMoney(row.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-amber-300" dir="ltr">
                      {formatMoney(row.expenses)}
                    </td>
                    <td className={`px-4 py-3 text-center font-mono ${row.counted && row.profit > 0 ? 'text-emerald-300' : 'text-slate-400'}`} dir="ltr">
                      {row.counted ? formatMoney(row.profit) : t('profitNotCounted')}
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
