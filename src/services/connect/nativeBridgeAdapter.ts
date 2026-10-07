import type { LabDevice } from '@/types/devices'
import type { ConnectSession, DeviceAdapter, TelemetryChunk } from '@/services/connect/types'

/**
 * Placeholder for meters / oscilloscopes that cannot be claimed from the browser.
 * Later this talks to a local native bridge (WebSocket) — not a public tunnel.
 */
export const nativeBridgeAdapter: DeviceAdapter = {
  protocol: 'native-bridge',

  isSupported() {
    return false
  },

  async connect(device: LabDevice): Promise<ConnectSession> {
    return { device, protocol: 'native-bridge', status: 'manual' }
  },

  async disconnect(_session: ConnectSession) {},

  async *read(_session: ConnectSession): AsyncGenerator<TelemetryChunk> {},
}
