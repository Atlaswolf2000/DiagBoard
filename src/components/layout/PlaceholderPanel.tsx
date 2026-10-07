import { useT } from '@/hooks/usePrefs'

interface PlaceholderPanelProps {
  title: string
  description: string
}

export function PlaceholderPanel({ title, description }: PlaceholderPanelProps) {
  const t = useT()
  return (
    <section className="flex h-full min-h-[420px] flex-col items-start justify-center rounded-xl border border-dashed border-slate-800 bg-lab-900/40 p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/80">{t('building')}</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-100">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">{description}</p>
    </section>
  )
}
