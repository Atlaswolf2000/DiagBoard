import { useEffect, useState } from 'react'
import { useLocale, useT } from '@/hooks/usePrefs'
import { loadBoardImage } from '@/lib/boardImageDb'
import type { LibraryRow, LibraryScanStep } from '@/types/library'

interface ScanReportViewProps {
  row: LibraryRow
}

function stageLabel(prefix: string, index: number): string {
  return `${prefix}${index + 1}`
}

export function ScanReportView({ row }: ScanReportViewProps) {
  const t = useT()
  const locale = useLocale()
  const steps = row.scanReport ?? []
  const [active, setActive] = useState(0)
  const [image, setImage] = useState(row.boardImage)
  const step = steps[active] as LibraryScanStep | undefined

  useEffect(() => {
    setImage(row.boardImage)
    if (row.boardImage) return
    void loadBoardImage(row.id).then((stored) => {
      if (stored) setImage(stored)
    })
  }, [row.boardImage, row.id])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-5">
      <div className="flex min-h-[360px] items-center justify-center overflow-auto rounded-lg border border-slate-800 bg-lab-950 p-3">
        {image ? (
          <div className="relative inline-block max-h-[70vh] max-w-full">
            <img
              src={image}
              alt={row.serialNumber}
              className="block max-h-[70vh] max-w-full object-contain"
            />
            {steps.map((item, index) => {
              const selected = index === active
              return (
                <button
                  key={`${item.part}-mark`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`scan-pin ${selected ? 'scan-pin-active' : ''}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  title={locale === 'ar' ? item.titleAr : item.titleEn}
                >
                  <span className="scan-pin-label">{stageLabel(t('scanStage'), index)}</span>
                  <span className="scan-pin-box" />
                  <span className="scan-pin-arrow" />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex h-full min-h-[360px] items-center justify-center p-6">
            <p className="text-sm text-slate-500">{t('scanBoardMissing')}</p>
          </div>
        )}
      </div>

      {steps.length ? (
        <div className="flex flex-wrap justify-start gap-2">
          {steps.map((item, index) => (
            <button
              key={`${item.part}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                index === active ? 'bg-cyan-500 text-lab-950' : 'border border-slate-700 bg-lab-850 text-slate-300'
              }`}
            >
              {stageLabel(t('scanStage'), index)}
            </button>
          ))}
        </div>
      ) : null}

      {step ? (
        <article className="rounded-lg border border-cyan-500/30 bg-lab-850 p-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-500 px-2 py-0.5 font-mono text-xs font-semibold text-lab-950">
              {stageLabel(t('scanStage'), active)}
            </span>
            <p className="text-sm font-semibold text-slate-100">{locale === 'ar' ? step.titleAr : step.titleEn}</p>
          </div>
          <p className="mt-2 text-xs leading-6 text-slate-400">{locale === 'ar' ? step.detailAr : step.detailEn}</p>
          <p className="mt-1 font-mono text-[11px] text-cyan-300">{step.part}</p>
        </article>
      ) : null}

      {steps.length ? (
        <ol className="space-y-2">
          {steps.map((item, index) => (
            <li key={`${item.part}-list`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`w-full rounded-lg border p-3 text-start ${
                  index === active ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-slate-800 bg-lab-850'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cyan-500 px-2 py-0.5 font-mono text-[11px] font-semibold text-lab-950">
                    {stageLabel(t('scanStage'), index)}
                  </span>
                  <span className="text-sm font-semibold text-slate-100">{locale === 'ar' ? item.titleAr : item.titleEn}</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">{locale === 'ar' ? item.detailAr : item.detailEn}</p>
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
