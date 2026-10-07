/// <reference types="vite/client" />

interface SerialPortInfo {
  usbVendorId?: number
  usbProductId?: number
}

interface SerialPort {
  readonly readable: ReadableStream<Uint8Array> | null
  readonly writable: WritableStream<Uint8Array> | null
  open(options: { baudRate: number }): Promise<void>
  close(): Promise<void>
  getInfo(): SerialPortInfo
  addEventListener(type: 'disconnect', listener: () => void): void
  removeEventListener(type: 'disconnect', listener: () => void): void
}

interface Serial {
  requestPort(options?: { filters?: Array<{ usbVendorId: number; usbProductId?: number }> }): Promise<SerialPort>
  getPorts(): Promise<SerialPort[]>
}

interface USBDevice {
  readonly vendorId: number
  readonly productId: number
  readonly productName?: string
  readonly opened: boolean
  open(): Promise<void>
  close(): Promise<void>
  selectConfiguration(configurationValue: number): Promise<void>
  claimInterface(interfaceNumber: number): Promise<void>
  transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>
  transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>
}

interface USBInTransferResult {
  readonly data?: DataView
  readonly status: 'ok' | 'stall' | 'babble'
}

interface USBOutTransferResult {
  readonly bytesWritten: number
  readonly status: 'ok' | 'stall'
}

interface USB {
  requestDevice(options?: { filters: Array<{ vendorId: number; productId?: number }> }): Promise<USBDevice>
  getDevices(): Promise<USBDevice[]>
}

interface Navigator {
  serial?: Serial
  usb?: USB
}
