export type DeviceKind = 'logic-analyzer' | 'board-analyzer' | 'meter' | 'thermal-camera' | 'smart-multimeter'

export type ConnectionProtocol = 'web-serial' | 'webusb' | 'native-bridge'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'degraded' | 'disconnected' | 'manual'

export interface LabDevice {
  id: string
  name: string
  kind: DeviceKind
  protocol: ConnectionProtocol
  vendorId?: number
  productId?: number
}

export interface HeartbeatSnapshot {
  deviceId: string
  status: ConnectionStatus
  lastBeatAt: number | null
  latencyMs: number | null
}
