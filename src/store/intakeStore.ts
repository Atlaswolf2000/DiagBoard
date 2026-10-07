import { createTicketNo, nowIso } from '@/lib/ticketDate'
import type { IntakeTicket } from '@/types/intake'

const DRAFT_KEY = 'diagboard.intake.draft'
const ACTIVE_KEY = 'diagboard.intake.active'

const listeners = new Set<() => void>()

function emptyTicket(): IntakeTicket {
  return {
    ticketNo: createTicketNo(),
    customerName: '',
    phone: '',
    deviceType: '',
    laptopBrand: '',
    serialNumber: '',
    deviceStatus: '',
    repairFee: '',
    depositPaid: '',
    notes: '',
    createdAt: nowIso(),
  }
}

function normalizeTicket(ticket: IntakeTicket): IntakeTicket {
  return {
    ...emptyTicket(),
    ...ticket,
    laptopBrand: ticket.laptopBrand ?? '',
    serialNumber: ticket.serialNumber ?? '',
    repairFee: ticket.repairFee ?? '',
    depositPaid: ticket.depositPaid ?? '',
  }
}

function readJson(key: string): IntakeTicket | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? normalizeTicket(JSON.parse(raw) as IntakeTicket) : null
  } catch {
    return null
  }
}

const LEGACY_KEY = 'diagboard.intake.current'

let active: IntakeTicket | null = readJson(ACTIVE_KEY) ?? readJson(LEGACY_KEY)
let draft: IntakeTicket = readJson(DRAFT_KEY) ?? emptyTicket()

if (active && !readJson(ACTIVE_KEY)) {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(active))
  localStorage.removeItem(LEGACY_KEY)
  draft = emptyTicket()
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function getIntakeDraft(): IntakeTicket {
  return draft
}

export function getIntakeTicket(): IntakeTicket | null {
  if (active) return active
  active = readJson(ACTIVE_KEY) ?? readJson(LEGACY_KEY)
  return active
}

export function subscribeIntake(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function startNewIntake(): IntakeTicket {
  draft = emptyTicket()
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  emit()
  return draft
}

export function saveIntakeTicket(ticket: IntakeTicket): IntakeTicket {
  active = ticket
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(ticket))
  draft = emptyTicket()
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  emit()
  return draft
}

export function hasActiveIntake(): boolean {
  if (!active?.customerName || !active.phone || !active.deviceType || !active.deviceStatus || !active.serialNumber) {
    return false
  }
  if (active.deviceType === 'لوحة أم لابتوب' && !active.laptopBrand) {
    return false
  }
  return true
}
