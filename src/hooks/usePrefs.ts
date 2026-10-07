import { useSyncExternalStore } from 'react'
import { getLocale, getTheme, subscribePrefs } from '@/store/prefsStore'
import { messages, type MessageKey } from '@/i18n/messages'

export function useTheme() {
  return useSyncExternalStore(subscribePrefs, getTheme, getTheme)
}

export function useLocale() {
  return useSyncExternalStore(subscribePrefs, getLocale, getLocale)
}

export function useT() {
  const locale = useLocale()
  return (key: MessageKey) => messages[locale][key]
}
