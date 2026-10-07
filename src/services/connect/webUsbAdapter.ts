import type { LabDevice } from '@/types/devices'
import type { ConnectSession, DeviceAdapter, TelemetryChunk } from '@/services/connect/types'

/**
 * WebUSB adapter — intended for LUOWEI FAT (smart board analyzer).
 * Browser constraint: navigator.usb.requestDevice() MUST run from a user gesture.
 */
export const webUsbAdapter: DeviceAdapter = {
  protocol: 'webusb',

  isSupported() {
    return Boolean(navigator.usb)
  },

  async connect(device: LabDevice): Promise<ConnectSession> {
    if (!navigator.usb) {
      throw new Error('WebUSB is not available in this browser')
    }

    const usbDevice = await navigator.usb.requestDevice({
      filters: device.vendorId ? [{ vendorId: device.vendorId }] : [],
    })

    await usbDevice.open()
    await usbDevice.selectConfiguration(1)
    await usbDevice.claimInterface(0)

    return { device, protocol: 'webusb', status: 'connected' }
  },

  async disconnect(_session: ConnectSession) {
    // usbDevice.close() will be wired once session stores the USBDevice handle.
  },

  async *read(_session: ConnectSession): AsyncGenerator<TelemetryChunk> {
    // transferIn loop will be implemented in the Auto-Fetch Engine step.
  },
}
