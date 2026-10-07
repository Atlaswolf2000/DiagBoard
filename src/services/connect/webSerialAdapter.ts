import type { LabDevice } from '@/types/devices'
import type { ConnectSession, DeviceAdapter, TelemetryChunk } from '@/services/connect/types'

/**
 * Web Serial adapter — intended for Kingst LA2016 (logic analyzer).
 * Browser constraint: navigator.serial.requestPort() MUST run from a user gesture.
 */
export const webSerialAdapter: DeviceAdapter = {
  protocol: 'web-serial',

  isSupported() {
    return Boolean(navigator.serial)
  },

  async connect(device: LabDevice): Promise<ConnectSession> {
    if (!navigator.serial) {
      throw new Error('Web Serial API is not available in this browser')
    }

    const port = await navigator.serial.requestPort()
    await port.open({ baudRate: 115200 })

    return { device, protocol: 'web-serial', status: 'connected' }
  },

  async disconnect(_session: ConnectSession) {
    // Port.close() will be wired once session stores the SerialPort handle.
  },

  async *read(_session: ConnectSession): AsyncGenerator<TelemetryChunk> {
    // ReadableStream pump will be implemented in the Auto-Fetch Engine step.
  },
}
