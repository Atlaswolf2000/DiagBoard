import { useState } from 'react'
import { Eye, EyeOff, KeyRound, Plus, RefreshCw } from 'lucide-react'
import { ROLE_KEYS, SYSTEM_SCREENS, USER_ROLES, type AccessUser } from '@/types/access'
import { useAccessUsers } from '@/hooks/useAccessUsers'
import { addAccessUser, regenerateCredentials, setUserRole, toggleScreen, updateAccessUser } from '@/store/accessStore'
import { useT } from '@/hooks/usePrefs'

export function AccessPage() {
  const t = useT()
  const users = useAccessUsers()
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const toggleReveal = (id: string) => {
    setRevealed((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-800 bg-lab-900 shadow-panel">
      <div className="flex items-center justify-between border-b border-slate-800 p-3">
        <p className="text-sm text-slate-400">{t('accessHint')}</p>
        <button
          type="button"
          onClick={() => addAccessUser()}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-lab-950 hover:bg-cyan-400"
        >
          <Plus className="h-4 w-4" />
          {t('newUser')}
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[1280px] border-collapse text-sm">
          <thead className="sticky top-0 bg-lab-850">
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-4 py-3 text-start font-medium">{t('accSeq')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('userName')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('userRole')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('username')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('password')}</th>
              <th className="px-4 py-3 text-start font-medium">{t('screensToggle')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                passwordVisible={Boolean(revealed[user.id])}
                onReveal={() => toggleReveal(user.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

interface UserRowProps {
  user: AccessUser
  index: number
  passwordVisible: boolean
  onReveal: () => void
}

function UserRow({ user, index, passwordVisible, onReveal }: UserRowProps) {
  const t = useT()

  return (
    <tr className="border-b border-slate-800/80 align-top text-slate-200">
      <td className="px-4 py-3 font-mono">{index + 1}</td>
      <td className="px-4 py-3">
        <input
          value={user.displayName}
          onChange={(event) => updateAccessUser(user.id, { displayName: event.target.value })}
          placeholder={t('userPlaceholder')}
          className="w-40 rounded-md border border-slate-800 bg-lab-850 px-2 py-1.5 text-sm outline-none focus:border-cyan-500/60"
        />
      </td>
      <td className="px-4 py-3">
        <select
          value={user.role}
          onChange={(event) => setUserRole(user.id, event.target.value as AccessUser['role'])}
          className="rounded-md border border-slate-800 bg-lab-850 px-2 py-1.5 text-sm outline-none focus:border-cyan-500/60"
        >
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {t(ROLE_KEYS[role])}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          dir="ltr"
          value={user.username}
          onChange={(event) => updateAccessUser(user.id, { username: event.target.value })}
          className="w-40 rounded-md border border-slate-800 bg-lab-850 px-2 py-1.5 font-mono text-sm outline-none focus:border-cyan-500/60"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            dir="ltr"
            type={passwordVisible ? 'text' : 'password'}
            value={user.password}
            onChange={(event) => updateAccessUser(user.id, { password: event.target.value })}
            className="w-36 rounded-md border border-slate-800 bg-lab-850 px-2 py-1.5 font-mono text-sm outline-none focus:border-cyan-500/60"
          />
          <button type="button" onClick={onReveal} className="text-slate-400 hover:text-cyan-300" title={t('showPassword')}>
            {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => regenerateCredentials(user.id, user.displayName)}
            className="text-slate-400 hover:text-cyan-300"
            title={t('regenCreds')}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex max-w-[520px] flex-wrap gap-2">
          {SYSTEM_SCREENS.map((screen) => {
            const on = user.screens[screen.id]
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => toggleScreen(user.id, screen.id)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                  on ? 'bg-cyan-500/15 text-cyan-300' : 'bg-lab-850 text-slate-500'
                }`}
              >
                {on ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {t(screen.labelKey)}
              </button>
            )
          })}
        </div>
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500">
          <KeyRound className="h-3 w-3" />
          {t('screensHint')}
        </p>
      </td>
    </tr>
  )
}
