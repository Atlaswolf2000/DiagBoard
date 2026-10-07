import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, CircuitBoard, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { NAV_ITEMS } from '@/config/nav'
import { toggleSidebar } from '@/store/uiStore'
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed'
import { useLocale, useT } from '@/hooks/usePrefs'

export function Sidebar() {
  const collapsed = useSidebarCollapsed()
  const { pathname } = useLocation()
  const locale = useLocale()
  const t = useT()
  const CollapseIcon = locale === 'ar' ? PanelRightClose : PanelLeftClose
  const ExpandIcon = locale === 'ar' ? PanelRightOpen : PanelLeftOpen
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const next: Record<string, boolean> = {}
    for (const item of NAV_ITEMS) {
      if (item.children?.some((child) => pathname === child.path || pathname.startsWith(`${item.path}/`))) {
        next[item.id] = true
      }
    }
    setOpenMenus((current) => ({ ...current, ...next }))
  }, [pathname])

  const toggleMenu = (id: string) => {
    setOpenMenus((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <aside
      className={`flex shrink-0 flex-col border-s border-slate-800/80 bg-lab-900 transition-[width] duration-200 print:hidden ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex items-center border-b border-slate-800/80 ${collapsed ? 'justify-center px-2 py-4' : 'gap-3 px-4 py-5'}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
          <CircuitBoard className="h-5 w-5" />
        </div>
        {collapsed ? null : (
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-wide text-slate-100">{t('appName')}</p>
            <p className="text-[11px] text-slate-500">{t('appTag')}</p>
          </div>
        )}
      </div>

      <nav className={`flex-1 space-y-1 ${collapsed ? 'p-2' : 'p-3'}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const childActive = item.children?.some((child) => pathname === child.path)
          const expanded = Boolean(openMenus[item.id])
          const label = t(item.labelKey)
          return (
            <div key={item.id}>
              <div className="flex items-center gap-1">
                <NavLink
                  to={item.path}
                  title={label}
                  className={({ isActive }) =>
                    `nav-item min-w-0 flex-1 ${collapsed ? 'justify-center px-0' : ''} ${isActive || childActive ? 'nav-item-active' : 'nav-item-idle'}`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {collapsed ? null : <span className="flex-1 text-start">{label}</span>}
                </NavLink>
                {!collapsed && item.children ? (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-lab-850 hover:text-cyan-300"
                    aria-label={label}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                ) : null}
              </div>
              {!collapsed && item.children && expanded
                ? item.children.map((child) => {
                    const ChildIcon = child.icon
                    const childLabel = t(child.labelKey)
                    return (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        title={childLabel}
                        className={({ isActive }) =>
                          `nav-item ms-4 ${isActive ? 'nav-item-active' : 'nav-item-idle'}`
                        }
                      >
                        <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1 text-start text-[13px]">{childLabel}</span>
                      </NavLink>
                    )
                  })
                : null}
            </div>
          )
        })}
      </nav>

      <div className={`border-t border-slate-800/80 ${collapsed ? 'p-2' : 'p-4'}`}>
        {collapsed ? null : (
          <>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{t('labStatus')}</p>
            <div className="mt-2 mb-3 flex items-center gap-2 text-xs text-slate-400">
              <span className="status-dot bg-amber-400" />
              {t('waitingConnect')}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className={`nav-item nav-item-idle ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? t('expandNav') : t('collapseNav')}
        >
          {collapsed ? <ExpandIcon className="h-4 w-4" /> : <CollapseIcon className="h-4 w-4" />}
          {collapsed ? null : <span className="flex-1 text-start">{t('collapseNav')}</span>}
        </button>
      </div>
    </aside>
  )
}
