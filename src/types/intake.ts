export const DEVICE_TYPES = [
  'لوحة أم لابتوب',
  'لوحة أم مكتبي',
  'لوحة أم سيرفر',
  'كرت شاشة',
  'أخرى',
] as const

export const DEVICE_STATUSES = [
  'لا يقلع',
  'لا توجد طاقة',
  'يعيد التشغيل',
  'يعمل مع أعطال',
  'حرارة زائدة',
  'أخرى',
] as const

export const LAPTOP_BRANDS = [
  'ASUS',
  'Dell',
  'HP',
  'Lenovo',
  'MSI',
  'Acer',
  'Apple',
  'Samsung',
  'Toshiba',
  'Huawei',
  'Gigabyte',
  'Razer',
  'Microsoft',
  'LG',
  'أخرى',
] as const

export const LAPTOP_DEVICE_TYPE = 'لوحة أم لابتوب' as const

export type DeviceType = (typeof DEVICE_TYPES)[number]
export type DeviceStatus = (typeof DEVICE_STATUSES)[number]
export type LaptopBrand = (typeof LAPTOP_BRANDS)[number]

export interface IntakeTicket {
  ticketNo: string
  customerName: string
  phone: string
  deviceType: DeviceType | ''
  laptopBrand: LaptopBrand | ''
  serialNumber: string
  deviceStatus: DeviceStatus | ''
  repairFee: string
  depositPaid: string
  notes: string
  createdAt: string
}
