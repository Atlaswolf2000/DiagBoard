export const PARTNER_IDS = ['haidar', 'adi'] as const

export type PartnerId = (typeof PARTNER_IDS)[number]

export interface PartnerPayout {
  id: string
  partnerId: PartnerId
  amount: number
  createdAt: string
}
