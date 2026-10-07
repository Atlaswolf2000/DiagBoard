import { useState } from 'react'
import { ScanSearch } from 'lucide-react'
import { useLocale, useT } from '@/hooks/usePrefs'
import { useBoardPhotos } from '@/hooks/useBoardPhotos'
import { DEMO_REPAIR_STEPS } from '@/config/repairSteps'
import { BoardMarker } from '@/components/workspace/BoardMarker'
import { getIntakeTicket } from '@/store/intakeStore'
import { upsertLibraryFromScan } from '@/store/libraryStore'
import { getBoardPhotos } from '@/store/boardPhotosStore'
import { compressDataUrl } from '@/lib/image'
import type { IntakeTicket } from '@/types/intake'

type ScanState = 'idle' | 'running' | 'done'

export function SystemScanPanel({ ticket }: { ticket: IntakeTicket | null }) {
  const t = useT()
  const locale = useLocale()
  const photos = useBoardPhotos()
  const [state, setState] = useState<ScanState>('idle')
  const [notice, setNotice] = useState('')
  const [activeId, setActiveId] = useState(DEMO_REPAIR_STEPS[0]?.id ?? '')

  const runScan = () => {
    setState('running')
    const activeTicket = ticket ?? getIntakeTicket()
    const photo = getBoardPhotos()[0] ?? ''
    if (!activeTicket) {
      setNotice(t('scanSaveMissing'))
      setState('idle')
      return
    }
    upsertLibraryFromScan(activeTicket, photo)
    setNotice(t('scanSaved'))
    if (photo) {
      void compressDataUrl(photo).then((compact) => {
        if (compact) upsertLibraryFromScan(activeTicket, compact)
      })
    }
    window.setTimeout(() => {
      setState('done')
      setActiveId(DEMO_REPAIR_STEPS[0]?.id ?? '')
    }, 900)
  }

  const statusLabel = state === 'idle' ? t('scanIdle') : state === 'running' ? t('scanRunning') : t('scanDone')
  const active = DEMO_REPAIR_STEPS.find((step) => step.id === activeId) ?? DEMO_REPAIR_STEPS[0]
  const boardImage = photos[0]
  const ready = state === 'done'

  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={runScan}
          disabled={state === 'running'}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-lab-950 hover:bg-cyan-400 disabled:opacity-60"
        >
          <ScanSearch className="h-4 w-4" />
          {state === 'running' ? t('scanning') : t('scanButton')}
        </button>
      </div>

      <article className="flex min-h-[420px] flex-col rounded-xl border border-slate-800 bg-lab-900 p-4 shadow-panel">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-100">{t('scanResult')}</h3>
          <span className="text-[11px] text-slate-500">{statusLabel}</span>
        </div>
        {notice ? <p className="mb-3 text-xs text-cyan-300">{notice}</p> : null}

        <div className="grid min-h-[360px] flex-1 gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2 overflow-auto rounded-lg border border-slate-800 bg-lab-950/40 p-3">
            {ready
              ? DEMO_REPAIR_STEPS.map((step, index) => {
                  const selected = step.id === active.id
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveId(step.id)}
                      className={`rounded-lg border p-3 text-start transition-colors ${
                        selected
                          ? 'border-cyan-400/50 bg-cyan-500/10'
                          : 'border-slate-800 bg-lab-900 hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lab-850 font-mono text-xs text-cyan-300">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-100">
                          {locale === 'ar' ? step.titleAr : step.titleEn}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-6 text-slate-400">
                        {locale === 'ar' ? step.detailAr : step.detailEn}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-cyan-300">{step.part}</p>
                    </button>
                  )
                })
              : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="max-w-sm text-center text-sm leading-7 text-slate-500">
                    {state === 'running' ? t('scanRunningHint') : t('scanIdleHint')}
                  </p>
                </div>
              )}
          </div>

          <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-800 bg-lab-950/50 p-3">
            {boardImage ? (
              <div className="relative inline-block max-h-[420px] max-w-full">
                <img src={boardImage} alt={t('boardGuide')} className="block max-h-[420px] max-w-full object-contain" />
                {ready && active ? <BoardMarker step={active} /> : null}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <p className="max-w-xs text-center text-sm leading-7 text-slate-500">{t('boardGuideEmpty')}</p>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}
