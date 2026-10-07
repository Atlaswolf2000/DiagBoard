import { useMemo, useState } from 'react'
import { CircleCheck, CircleDashed, FileSearch, Layers, Search, X } from 'lucide-react'
import { matchesQuery } from '@/lib/smartSearch'
import { formatShortDate } from '@/lib/workshopDays'
import { useT } from '@/hooks/usePrefs'
import type { MessageKey } from '@/i18n/messages'
import { useLibrary } from '@/hooks/useLibrary'
import type { LibraryRow } from '@/types/library'
import { ScanReportView } from '@/components/library/ScanReportView'

export function LibraryPage() {
  const t = useT()
  const rows = useLibrary()
  const [query, setQuery] = useState('')
  const [reportRow, setReportRow] = useState<LibraryRow | null>(null)
  const columns: MessageKey[] = [
    'colSeq',
    'colBoardType',
    'colModel',
    'colSerial',
    'colDeviceStatus',
    'colInspected',
    'colDelivered',
    'colScanReport',
  ]

  const filtered = useMemo(
    () =>
      rows.filter((row, index) =>
        matchesQuery(
          [
            index + 1,
            row.boardType,
            row.model,
            row.serialNumber,
            row.deviceStatus,
            formatShortDate(row.inspectedAt),
            formatShortDate(row.deliveredAt),
            ...(row.scanReport ?? []).flatMap((step) => [step.part, step.titleAr, step.titleEn]),
          ],
          query,
        ),
      ),
    [query, rows],
  )

  const stats = [
    { id: 'total', labelKey: 'totalCount' as const, value: rows.length, icon: Layers, tone: 'text-cyan-300 bg-cyan-500/10' },
    {
      id: 'done',
      labelKey: 'doneCount' as const,
      value: rows.filter((row) => row.deliveredAt).length,
      icon: CircleCheck,
      tone: 'text-emerald-300 bg-emerald-500/10',
    },
    {
      id: 'pending',
      labelKey: 'pendingCount' as const,
      value: rows.filter((row) => !row.deliveredAt).length,
      icon: CircleDashed,
      tone: 'text-amber-300 bg-amber-500/10',
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article key={stat.id} className="rounded-xl border border-slate-800 bg-lab-900 p-5 shadow-panel">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-400">{t(stat.labelKey)}</p>
                  <p className="mt-3 font-mono text-3xl font-semibold text-slate-50">{stat.value}</p>
                </div>
                <span className={`rounded-md p-2 ${stat.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-lab-900 shadow-panel">
        <div className="flex justify-start border-b border-slate-800 p-3">
          <label className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('librarySearch')}
              className="w-full rounded-lg border border-slate-800 bg-lab-850 py-2 ps-10 pe-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500/60"
            />
          </label>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead className="sticky top-0 bg-lab-850">
              <tr className="border-b border-slate-800 text-slate-400">
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-start font-medium">
                    {t(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center text-slate-500">
                    {query.trim() ? t('noMatches') : t('noRecords')}
                  </td>
                </tr>
              ) : (
                filtered.map((row, index) => (
                  <tr key={row.id} className="border-b border-slate-800/80 text-slate-200">
                    <td className="px-4 py-3 font-mono">{index + 1}</td>
                    <td className="px-4 py-3">{row.boardType}</td>
                    <td className="px-4 py-3">{row.model}</td>
                    <td className="px-4 py-3 font-mono">{row.serialNumber}</td>
                    <td className="px-4 py-3">{row.deviceStatus}</td>
                    <td className="px-4 py-3">{formatShortDate(row.inspectedAt)}</td>
                    <td className="px-4 py-3">{formatShortDate(row.deliveredAt)}</td>
                    <td className="px-4 py-3">
                      {row.scanReport?.length ? (
                        <button
                          type="button"
                          onClick={() => setReportRow(row)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-lab-850 px-3 py-1.5 text-xs text-slate-200 hover:bg-lab-800"
                        >
                          <FileSearch className="h-3.5 w-3.5" />
                          {t('viewScanReport')}
                        </button>
                      ) : (
                        <span className="text-slate-500">{t('noScanReport')}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {reportRow ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-lab-950/70 p-4 print:hidden">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-lab-900 shadow-panel">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">{t('scanReportTitle')}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {(rows.find((item) => item.id === reportRow.id) ?? reportRow).boardType} —{' '}
                  {(rows.find((item) => item.id === reportRow.id) ?? reportRow).serialNumber}
                </p>
              </div>
              <button type="button" onClick={() => setReportRow(null)} className="icon-btn" title={t('hideScanReport')}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <ScanReportView row={rows.find((item) => item.id === reportRow.id) ?? reportRow} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
