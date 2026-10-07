import { useState } from 'react'
import { useT } from '@/hooks/usePrefs'
import type { MessageKey } from '@/i18n/messages'

type MovementFilter =
  | 'in-workshop'
  | 'ready-delivery'
  | 'waiting-part'
  | 'delayed'
  | 'ready-uncollected'

const FILTERS: Array<{ id: MovementFilter; labelKey: MessageKey; count: number }> = [
  { id: 'in-workshop', labelKey: 'inWorkshop', count: 0 },
  { id: 'ready-delivery', labelKey: 'readyDelivery', count: 0 },
  { id: 'waiting-part', labelKey: 'waitingPart', count: 0 },
  { id: 'delayed', labelKey: 'delayed', count: 0 },
  { id: 'ready-uncollected', labelKey: 'readyUncollected', count: 0 },
]

export function DeviceMovementReportPage() {
  const t = useT()
  const [active, setActive] = useState<MovementFilter>('in-workshop')
  const current = FILTERS.find((filter) => filter.id === active)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-start gap-2">
        {FILTERS.map((filter) => {
          const selected = filter.id === active
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActive(filter.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? 'bg-cyan-500 text-lab-950'
                  : 'border border-slate-700 bg-lab-900 text-slate-300 hover:border-cyan-500/40 hover:text-slate-100'
              }`}
            >
              {t(filter.labelKey)} {filter.count}
            </button>
          )
        })}
      </div>

      <section className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-lab-900/40">
        <p className="text-sm text-slate-500">
          {t('noDevicesIn')} «{current ? t(current.labelKey) : ''}»
        </p>
      </section>
    </div>
  )
}
