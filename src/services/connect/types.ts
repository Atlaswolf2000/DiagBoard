import type { ConnectionProtocol, ConnectionStatus, LabDevice } from '@/types/devices'

export interface ConnectSession {
  device: LabDevice
  protocol: ConnectionProtocol
  status: ConnectionStatus
}

export interface TelemetryChunk {
  deviceId: string
  receivedAt: number
  payload: Uint8Array
}

export interface DeviceAdapter {
  readonly protocol: ConnectionProtocol
  isSupported(): boolean
  connect(device: LabDevice): Promise<ConnectSession>
  disconnect(session: ConnectSession): Promise<void>
  read(session: ConnectSession): AsyncGenerator<TelemetryChunk>
}
