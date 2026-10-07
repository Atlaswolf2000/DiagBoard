import { useSyncExternalStore } from 'react'
import { getPartnerPayouts, subscribePayouts } from '@/store/payoutsStore'

export function usePayouts() {
  return useSyncExternalStore(subscribePayouts, getPartnerPayouts, getPartnerPayouts)
}
