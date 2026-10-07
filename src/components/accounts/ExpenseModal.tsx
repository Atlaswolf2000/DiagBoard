import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { ImagePlus, Receipt, X } from 'lucide-react'
import { EXPENSE_TYPES, type ExpenseType, type TicketExpense } from '@/types/expenses'
import type { AccountRow } from '@/types/accounts'
import { useT } from '@/hooks/usePrefs'
import type { MessageKey } from '@/i18n/messages'
import { parseAmount } from '@/lib/money'
import { formatMoney, formatShortDate } from '@/lib/workshopDays'
import { addTicketExpense, expensesFor } from '@/store/expensesStore'
import { useExpenses } from '@/hooks/useExpenses'

const TYPE_KEYS: Record<ExpenseType, MessageKey> = {
  'قطعة غيار': 'expensePart',
  شحن: 'expenseShipping',
  'أجور فني': 'expenseLabor',
  'مواد استهلاكية': 'expenseConsumable',
  أخرى: 'expenseOther',
}

interface ExpenseModalProps {
  row: AccountRow
  onClose: () => void
}

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function ExpenseModal({ row, onClose }: ExpenseModalProps) {
  const t = useT()
  const all = useExpenses()
  const history = useMemo(() => expensesFor(row.ticketNo), [all, row.ticketNo])
  const [type, setType] = useState<ExpenseType | ''>('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [imageData, setImageData] = useState('')
  const [preview, setPreview] = useState<TicketExpense | null>(null)
  const total = history.reduce((sum, item) => sum + item.amount, 0)

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const data = await readImage(file)
    setImageData(data)
  }

  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!type) return
    const value = parseAmount(amount)
    if (value <= 0) return
    addTicketExpense(row.ticketNo, type, value, note.trim(), imageData)
    setType('')
    setAmount('')
    setNote('')
    setImageData('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lab-950/70 p-4 print:hidden">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-lab-900 shadow-panel">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{t('expenseTitle')}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {row.customerName} — {row.ticketNo}
            </p>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" title={t('closeModal')}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={save} className="grid gap-3 border-b border-slate-800 p-5 md:grid-cols-2">
          <label className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-lab-850 px-3 py-2">
            <span className="text-[11px] text-slate-500">{t('expenseType')}</span>
            <select
              required
              value={type}
              onChange={(event) => setType(event.target.value as ExpenseType)}
              className="bg-transparent text-sm text-slate-100 outline-none"
            >
              <option value="" disabled>
                {t('chooseExpense')}
              </option>
              {EXPENSE_TYPES.map((item) => (
                <option key={item} value={item}>
                  {t(TYPE_KEYS[item])}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-lab-850 px-3 py-2">
            <span className="text-[11px] text-slate-500">{t('expenseAmount')}</span>
            <input
              required
              dir="ltr"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={t('iqdPlaceholder')}
              className="bg-transparent font-mono text-sm text-slate-100 outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 rounded-lg border border-slate-800 bg-lab-850 px-3 py-2 md:col-span-2">
            <span className="text-[11px] text-slate-500">{t('expenseNote')}</span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t('expenseNotePlaceholder')}
              className="bg-transparent text-sm text-slate-100 outline-none"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-700 bg-lab-850 px-3 py-3 md:col-span-2">
            <ImagePlus className="h-4 w-4 text-cyan-300" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-200">{t('expenseReceipt')}</p>
              <p className="text-[11px] text-slate-500">{t('expenseUpload')}</p>
            </div>
            {imageData ? <img src={imageData} alt="" className="h-12 w-12 rounded object-cover" /> : null}
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-lab-950 hover:bg-cyan-400 md:col-span-2"
          >
            <Receipt className="h-4 w-4" />
            {t('expenseSave')}
          </button>
        </form>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-100">{t('expenseHistory')}</h4>
            <p className="font-mono text-sm text-amber-300" dir="ltr">
              {formatMoney(total)}
            </p>
          </div>
          {history.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">{t('noExpenses')}</p>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.id} className="rounded-lg border border-slate-800 bg-lab-850 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-100">{t(TYPE_KEYS[item.type])}</p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {formatShortDate(item.createdAt)} {item.note ? `— ${item.note}` : ''}
                      </p>
                    </div>
                    <p className="font-mono text-sm text-amber-300" dir="ltr">
                      {formatMoney(item.amount)}
                    </p>
                  </div>
                  {item.imageData ? (
                    <button
                      type="button"
                      onClick={() => setPreview(preview?.id === item.id ? null : item)}
                      className="mt-2 text-xs text-cyan-300"
                    >
                      {preview?.id === item.id ? t('hideReceipt') : t('viewReceipt')}
                    </button>
                  ) : null}
                  {preview?.id === item.id && item.imageData ? (
                    <img src={item.imageData} alt="" className="mt-2 max-h-64 w-full rounded object-contain" />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
