import type { Locale, ThemeMode } from '@/types/prefs'

const THEME_KEY = 'diagboard.ui.theme'
const LOCALE_KEY = 'diagboard.ui.locale'

const listeners = new Set<() => void>()

function readTheme(): ThemeMode {
  try {
    return localStorage.getItem(THEME_KEY) === 'day' ? 'day' : 'night'
  } catch {
    return 'night'
  }
}

function readLocale(): Locale {
  try {
    return localStorage.getItem(LOCALE_KEY) === 'en' ? 'en' : 'ar'
  } catch {
    return 'ar'
  }
}

let theme: ThemeMode = readTheme()
let locale: Locale = readLocale()

function emit() {
  listeners.forEach((listener) => listener())
}

export function applyDocumentPrefs(nextTheme = theme, nextLocale = locale) {
  const root = document.documentElement
  root.dataset.theme = nextTheme
  root.lang = nextLocale
  root.dir = nextLocale === 'ar' ? 'rtl' : 'ltr'
  document.title = nextLocale === 'ar' ? 'DiagBoard — تشخيص اللوحات الأم' : 'DiagBoard — Motherboard Diagnostics'
}

export function getTheme(): ThemeMode {
  return theme
}

export function getLocale(): Locale {
  return locale
}

export function subscribePrefs(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function toggleTheme(): void {
  theme = theme === 'night' ? 'day' : 'night'
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore quota */
  }
  applyDocumentPrefs()
  emit()
}

export function toggleLocale(): void {
  locale = locale === 'ar' ? 'en' : 'ar'
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    /* ignore quota */
  }
  applyDocumentPrefs()
  emit()
}

applyDocumentPrefs()
