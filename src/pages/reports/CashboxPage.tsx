import { useMemo } from 'react'
import { useAccounts } from '@/hooks/useAccounts'
import { useT } from '@/hooks/usePrefs'
import { formatMoney } from '@/lib/workshopDays'

export function CashboxPage() {
  const t = useT()
  const rows = useAccounts()
  const totalCollected = useMemo(
    () => rows.reduce((sum, row) => sum + row.collectedAmount, 0),
    [rows],
  )

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-start gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">{t('cashboxTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('cashboxHint')}</p>
        </div>
        <article className="rounded-xl border border-slate-800 bg-lab-900 px-5 py-4 shadow-panel">
          <p className="text-xs text-slate-500">{t('cashboxTotal')}</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-emerald-300" dir="ltr">
            {formatMoney(totalCollected)}
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
                <th className="px-4 py-3 text-center font-medium">{t('cashboxCollected')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center text-slate-500">
                    {t('noCashbox')}
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="border-b border-slate-800/80 text-slate-200">
                    <td className="px-4 py-3 text-center font-mono">{index + 1}</td>
                    <td className="px-4 py-3 text-center">{row.customerName}</td>
                    <td className="px-4 py-3 text-center font-mono" dir="ltr">
                      {formatMoney(row.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-emerald-300" dir="ltr">
                      {formatMoney(row.collectedAmount)}
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
