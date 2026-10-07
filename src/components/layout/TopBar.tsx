import { useLocation } from 'react-router-dom'
import { Activity, Languages, Moon, PanelLeftOpen, PanelRightOpen, Radio, Sun } from 'lucide-react'
import { findNavMatch } from '@/config/nav'
import { toggleSidebar } from '@/store/uiStore'
import { toggleLocale, toggleTheme } from '@/store/prefsStore'
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed'
import { useLocale, useT, useTheme } from '@/hooks/usePrefs'
import { messages } from '@/i18n/messages'

export function TopBar() {
  const { pathname } = useLocation()
  const current = findNavMatch(pathname)
  const collapsed = useSidebarCollapsed()
  const theme = useTheme()
  const locale = useLocale()
  const t = useT()
  const ExpandIcon = locale === 'ar' ? PanelRightOpen : PanelLeftOpen
  const title = current ? t(current.labelKey) : t('appName')

  return (
    <header className="app-topbar flex h-14 shrink-0 items-center justify-between border-b border-slate-800/80 bg-lab-900/80 px-5 backdrop-blur print:hidden">
      <div className="flex items-center gap-3">
        {collapsed ? (
          <button type="button" onClick={toggleSidebar} className="icon-btn" title={t('expandNav')}>
            <ExpandIcon className="h-4 w-4" />
          </button>
        ) : null}
        <div>
          <h1 className="text-sm font-semibold text-slate-100">{title}</h1>
          <p className="text-[11px] text-slate-500">{current?.hint}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-lab-850 px-2.5 py-1">
          <Radio className="h-3 w-3 text-amber-400" />
          {t('devicesOffline')}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-lab-850 px-2.5 py-1">
          <Activity className="h-3 w-3 text-cyan-400" />
          {t('heartbeat')}
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          className="icon-btn"
          title={theme === 'night' ? t('themeToDay') : t('themeToNight')}
        >
          {theme === 'night' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleLocale}
          className="icon-btn min-w-9 font-semibold"
          title={locale === 'ar' ? messages.en.langToEn : messages.ar.langToAr}
        >
          <Languages className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
