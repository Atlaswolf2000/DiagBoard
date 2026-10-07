import type { RepairStep } from '@/types/scan'

export function BoardMarker({ step }: { step: RepairStep }) {
  return (
    <span className="board-marker" style={{ left: `${step.x}%`, top: `${step.y}%` }} title={step.part}>
      <span className="board-marker-ring" />
      <span className="board-marker-label">{step.part}</span>
    </span>
  )
}
