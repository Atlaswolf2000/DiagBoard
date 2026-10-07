import { Cable, Gauge, Thermometer, Usb, Workflow } from 'lucide-react'
import type { LabDevice } from '@/types/devices'
import { useT } from '@/hooks/usePrefs'

const PROTOCOL_META = {
  'web-serial': { label: 'Web Serial API', icon: Cable },
  webusb: { label: 'WebUSB', icon: Usb },
  'native-bridge': { label: 'Native Bridge', icon: Workflow },
} as const

interface ConnectionCardProps {
  device: LabDevice
}

export function ConnectionCard({ device }: ConnectionCardProps) {
  const t = useT()
  const meta = PROTOCOL_META[device.protocol]
  const Icon =
    device.kind === 'thermal-camera' ? Thermometer : device.kind === 'smart-multimeter' ? Gauge : meta.icon
  const name =
    device.id === 'generic-meter'
      ? t('meterDevice')
      : device.id === 'thermal-camera'
        ? t('thermalCamera')
        : device.id === 'smart-multimeter'
          ? t('smartMultimeter')
          : device.name

  return (
    <article className="rounded-xl border border-slate-800 bg-lab-900 p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">{name}</p>
          <p className="mt-1 text-xs text-slate-500">{meta.label}</p>
        </div>
        <span className="rounded-md bg-lab-850 p-2 text-cyan-300">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <span className="status-dot bg-slate-500" />
        {t('disconnectedReady')}
      </div>
    </article>
  )
}
