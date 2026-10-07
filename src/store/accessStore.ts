import { createUserId, generatePassword, generateUsername } from '@/lib/credentials'
import { SYSTEM_SCREENS, type AccessUser, type ScreenAccess, type ScreenId, type UserRole } from '@/types/access'

const STORAGE_KEY = 'diagboard.access.users'

const listeners = new Set<() => void>()

function defaultScreens(visible: boolean): ScreenAccess {
  return SYSTEM_SCREENS.reduce((acc, screen) => {
    acc[screen.id] = visible
    return acc
  }, {} as ScreenAccess)
}

function seedUsers(): AccessUser[] {
  return [
    {
      id: createUserId(),
      displayName: 'المدير',
      role: 'مدير',
      username: 'admin.001',
      password: generatePassword(),
      screens: defaultScreens(true),
    },
  ]
}

function readStored(): AccessUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedUsers()
    const parsed = JSON.parse(raw) as AccessUser[]
    return Array.isArray(parsed) ? parsed : seedUsers()
  } catch {
    return seedUsers()
  }
}

let users = readStored()

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  listeners.forEach((listener) => listener())
}

export function getAccessUsers(): AccessUser[] {
  return users
}

export function subscribeAccess(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function addAccessUser(): AccessUser {
  const next: AccessUser = {
    id: createUserId(),
    displayName: '',
    role: 'فني',
    username: generateUsername('user'),
    password: generatePassword(),
    screens: defaultScreens(false),
  }
  users = [...users, next]
  persist()
  return next
}

export function updateAccessUser(id: string, patch: Partial<AccessUser>): void {
  users = users.map((user) => (user.id === id ? { ...user, ...patch } : user))
  persist()
}

export function toggleScreen(id: string, screenId: ScreenId): void {
  users = users.map((user) =>
    user.id === id ? { ...user, screens: { ...user.screens, [screenId]: !user.screens[screenId] } } : user,
  )
  persist()
}

export function regenerateCredentials(id: string, displayName: string): void {
  updateAccessUser(id, {
    username: generateUsername(displayName || 'user'),
    password: generatePassword(),
  })
}

export function setUserRole(id: string, role: UserRole): void {
  updateAccessUser(id, { role })
}
