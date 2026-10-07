export const ACCOUNT_STATUSES = ['قيد الفحص', 'أنجزت', 'تم التسليم', 'تم الإرجاع'] as const

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]

export interface AccountRow {
  id: string
  ticketNo: string
  customerName: string
  totalAmount: number
  newPrice: number
  collectedAmount: number
  entryDate: string
  exitDate: string | null
  status: AccountStatus
  notes: string
}
