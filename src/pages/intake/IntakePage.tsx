import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Printer, Save, Wrench } from 'lucide-react'
import { A5IntakeCard } from '@/components/intake/A5IntakeCard'
import { getIntakeDraft, getIntakeTicket, hasActiveIntake, saveIntakeTicket } from '@/store/intakeStore'
import { postIntakeInvoice } from '@/store/accountsStore'
import type { IntakeTicket } from '@/types/intake'
import { useT } from '@/hooks/usePrefs'

export function IntakePage() {
  const navigate = useNavigate()
  const t = useT()
  const [ticket, setTicket] = useState<IntakeTicket>(() => getIntakeDraft())
  const [canOpenRepair, setCanOpenRepair] = useState(() => hasActiveIntake())

  const saveCard = (next: IntakeTicket) => {
    postIntakeInvoice(next)
    const fresh = saveIntakeTicket(next)
    setTicket(fresh)
    setCanOpenRepair(true)
  }

  const openWorkspace = () => {
    if (!getIntakeTicket()) return
    navigate('/workspace')
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
      <div className="w-full max-w-[148mm] text-start">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-400/80">{t('intakeKicker')}</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-50">{t('intakeTitle')}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-400">{t('intakeHint')}</p>
      </div>

      <A5IntakeCard ticket={ticket} onChange={setTicket} onSubmit={saveCard} />

      <div className="flex w-full max-w-[148mm] flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-lab-850 px-4 py-2.5 text-sm text-slate-200 hover:bg-lab-800"
        >
          <Printer className="h-4 w-4" />
          {t('printA5')}
        </button>
        <button
          type="submit"
          form="intake-card"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-lab-850 px-4 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-lab-800"
        >
          <Save className="h-4 w-4" />
          {t('saveIntake')}
        </button>
        <button
          type="button"
          onClick={openWorkspace}
          disabled={!canOpenRepair}
          title={canOpenRepair ? undefined : t('saveFirstHint')}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-lab-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Wrench className="h-4 w-4" />
          {t('openRepair')}
        </button>
      </div>
    </div>
  )
}
