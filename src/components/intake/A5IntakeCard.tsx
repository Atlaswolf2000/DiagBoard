import type { FormEvent } from 'react'
import {
  DEVICE_STATUSES,
  DEVICE_TYPES,
  LAPTOP_BRANDS,
  LAPTOP_DEVICE_TYPE,
  type DeviceStatus,
  type DeviceType,
  type IntakeTicket,
  type LaptopBrand,
} from '@/types/intake'
import { formatTicketDate, formatTicketTime } from '@/lib/ticketDate'
import { useT } from '@/hooks/usePrefs'
import type { MessageKey } from '@/i18n/messages'

const TYPE_KEYS: Record<DeviceType, MessageKey> = {
  'لوحة أم لابتوب': 'typeLaptop',
  'لوحة أم مكتبي': 'typeDesktop',
  'لوحة أم سيرفر': 'typeServer',
  'كرت شاشة': 'typeGpu',
  أخرى: 'typeOther',
}

const STATUS_KEYS: Record<DeviceStatus, MessageKey> = {
  'لا يقلع': 'statusNoBoot',
  'لا توجد طاقة': 'statusNoPower',
  'يعيد التشغيل': 'statusRestart',
  'يعمل مع أعطال': 'statusFaulty',
  'حرارة زائدة': 'statusHot',
  أخرى: 'statusOther',
}

interface A5IntakeCardProps {
  ticket: IntakeTicket
  onChange: (ticket: IntakeTicket) => void
  onSubmit: (ticket: IntakeTicket) => void
}

export function A5IntakeCard({ ticket, onChange, onSubmit }: A5IntakeCardProps) {
  const t = useT()
  const patch = (partial: Partial<IntakeTicket>) => onChange({ ...ticket, ...partial })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(ticket)
  }

  return (
    <form id="intake-card" onSubmit={handleSubmit} className="a5-sheet">
      <header className="a5-head">
        <div>
          <p className="a5-kicker">DiagBoard</p>
          <h1 className="a5-title">{t('cardTitle')}</h1>
        </div>
        <div className="a5-ticket-no">
          <span>{t('ticketNo')}</span>
          <strong>{ticket.ticketNo}</strong>
        </div>
      </header>

      <div className="a5-grid">
        <label className="a5-cell">
          <span>{t('customerName')}</span>
          <input
            required
            value={ticket.customerName}
            onChange={(e) => patch({ customerName: e.target.value })}
            placeholder={t('customerPlaceholder')}
          />
        </label>

        <label className="a5-cell">
          <span>{t('phone')}</span>
          <input
            required
            type="tel"
            dir="ltr"
            value={ticket.phone}
            onChange={(e) => patch({ phone: e.target.value })}
            placeholder="07xxxxxxxxx"
          />
        </label>

        <label className="a5-cell a5-cell-locked">
          <span>{t('date')}</span>
          <input readOnly value={`${formatTicketDate(ticket.createdAt)} — ${formatTicketTime(ticket.createdAt)}`} />
        </label>

        <label className="a5-cell">
          <span>{t('deviceType')}</span>
          <select
            required
            value={ticket.deviceType}
            onChange={(e) => {
              const deviceType = e.target.value as IntakeTicket['deviceType']
              patch({
                deviceType,
                laptopBrand: deviceType === LAPTOP_DEVICE_TYPE ? ticket.laptopBrand : '',
              })
            }}
          >
            <option value="" disabled>
              {t('chooseType')}
            </option>
            {DEVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(TYPE_KEYS[type])}
              </option>
            ))}
          </select>
        </label>

        {ticket.deviceType === LAPTOP_DEVICE_TYPE ? (
          <label className="a5-cell a5-span-2">
            <span>{t('laptopBrand')}</span>
            <select
              required
              value={ticket.laptopBrand}
              onChange={(e) => patch({ laptopBrand: e.target.value as LaptopBrand })}
            >
              <option value="" disabled>
                {t('chooseBrand')}
              </option>
              {LAPTOP_BRANDS.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="a5-cell a5-span-2">
          <span>{t('serialNumber')}</span>
          <input
            required
            dir="ltr"
            value={ticket.serialNumber}
            onChange={(e) => patch({ serialNumber: e.target.value })}
            placeholder={t('serialPlaceholder')}
          />
        </label>

        <label className="a5-cell a5-span-2">
          <span>{t('deviceStatus')}</span>
          <select
            required
            value={ticket.deviceStatus}
            onChange={(e) => patch({ deviceStatus: e.target.value as IntakeTicket['deviceStatus'] })}
          >
            <option value="" disabled>
              {t('chooseStatus')}
            </option>
            {DEVICE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(STATUS_KEYS[status])}
              </option>
            ))}
          </select>
        </label>

        <label className="a5-cell">
          <span>{t('repairFee')}</span>
          <input
            required
            inputMode="decimal"
            dir="ltr"
            value={ticket.repairFee}
            onChange={(e) => patch({ repairFee: e.target.value })}
            placeholder={t('iqdPlaceholder')}
          />
        </label>

        <label className="a5-cell">
          <span>{t('depositPaid')}</span>
          <input
            required
            inputMode="decimal"
            dir="ltr"
            value={ticket.depositPaid}
            onChange={(e) => patch({ depositPaid: e.target.value })}
            placeholder={t('iqdPlaceholder')}
          />
        </label>

        <label className="a5-cell a5-span-2 a5-notes">
          <span>{t('notes')}</span>
          <textarea
            rows={5}
            value={ticket.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder={t('notesPlaceholder')}
          />
        </label>
      </div>

      <footer className="a5-foot">
        <div>
          <p>{t('customerSign')}</p>
          <span />
        </div>
        <div>
          <p>{t('receiverSign')}</p>
          <span />
        </div>
      </footer>
    </form>
  )
}
