import type { ConnectionProtocol, LabDevice } from '@/types/devices'
import type { DeviceAdapter } from '@/services/connect/types'
import { nativeBridgeAdapter } from '@/services/connect/nativeBridgeAdapter'
import { webSerialAdapter } from '@/services/connect/webSerialAdapter'
import { webUsbAdapter } from '@/services/connect/webUsbAdapter'

const adapters: Record<ConnectionProtocol, DeviceAdapter> = {
  'web-serial': webSerialAdapter,
  webusb: webUsbAdapter,
  'native-bridge': nativeBridgeAdapter,
}

export function getAdapter(protocol: ConnectionProtocol): DeviceAdapter {
  return adapters[protocol]
}

/**
 * Connect Layer entry — Node B in the architecture diagram.
 * Auto-connect (Node A) will iterate LAB_DEVICES and call this from a click handler.
 */
export async function connectDevice(device: LabDevice) {
  const adapter = getAdapter(device.protocol)

  if (!adapter.isSupported()) {
    return adapter.connect(device)
  }

  return adapter.connect(device)
}
