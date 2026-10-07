import { PlaceholderPanel } from '@/components/layout/PlaceholderPanel'
import { useT } from '@/hooks/usePrefs'

export function InsightsPage() {
  const t = useT()
  return <PlaceholderPanel title={t('insightsTitle')} description={t('insightsDesc')} />
}
