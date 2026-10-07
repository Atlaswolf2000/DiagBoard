import type { ConnectionStatus, HeartbeatSnapshot } from '@/types/devices'

const STALE_MS = 3_000

export function evaluateHeartbeat(snapshot: HeartbeatSnapshot, now = Date.now()): ConnectionStatus {
  if (snapshot.status === 'manual' || snapshot.status === 'idle') {
    return snapshot.status
  }

  if (!snapshot.lastBeatAt) {
    return 'disconnected'
  }

  return now - snapshot.lastBeatAt > STALE_MS ? 'degraded' : 'connected'
}

/**
 * Heartbeat Guard: if the device goes silent, the UI must switch the technician
 * to manual mode instead of feeding stale telemetry into the AI engine.
 */
export function shouldEnterManualMode(status: ConnectionStatus): boolean {
  return status === 'degraded' || status === 'disconnected'
}
