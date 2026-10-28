import { useState } from 'react'
import { useStore } from '../store'
import { today as getToday } from '../seed'
import StatusBadge from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import { BookingForm } from '../components/Forms'
import { useToast } from '../components/Toast'
import { formatDate, formatTime, isoDay, parseDay } from '../utils'
import type { Appointment, AppointmentStatus } from '../types'

type Filter = 'all' | AppointmentStatus

const filters: Filter[] = ['all', 'scheduled', 'completed', 'cancelled']

const dayLabel = (iso: string, today: string) => {
  const t = parseDay(today)
  const offset = (n: number) => {
    const d = new Date(t)
    d.setDate(t.getDate() + n)
    return isoDay(d)
  }
  if (iso === today) return 'Today'
  if (iso === offset(1)) return 'Tomorrow'
  if (iso === offset(-1)) return 'Yesterday'
  return formatDate(iso, { weekday: 'long', month: 'short', day: 'numeric' })
}

export default function Appointments() {
  const { patients, appointments, setStatus } = useStore()
  const toast = useToast()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [booking, setBooking] = useState(false)
  const today = getToday()

  const nameOf = (id: string) => patients.find((p) => p.id === id)?.name ?? 'Unknown'
  const countOf = (f: Filter) => (f === 'all' ? appointments.length : appointments.filter((a) => a.status === f).length)

  const q = query.trim().toLowerCase()
  const list = appointments
    .filter((a) => filter === 'all' || a.status === filter)
    .filter((a) => `${nameOf(a.patientId)} ${a.reason}`.toLowerCase().includes(q))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  const byDate = list.reduce<Record<string, Appointment[]>>((g, a) => {
    ;(g[a.date] ??= []).push(a)
    return g
  }, {})
  // Today and upcoming days first (soonest first), then past days (most recent first)
  const dates = Object.keys(byDate)
  const groups = [...dates.filter((d) => d >= today), ...dates.filter((d) => d < today).reverse()].map(
    (d) => [d, byDate[d]] as const,
  )

  const update = (a: Appointment, status: AppointmentStatus) => {
    setStatus(a.id, status)
    toast(`Appointment ${status === 'completed' ? 'marked complete' : 'cancelled'}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle="Manage bookings and track visit status"
        actions={
          <button className="btn" onClick={() => setBooking(true)}>
            <Icon name="plus" className="h-4 w-4" />
            Book appointment
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                  filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
                <span
                  className={`rounded-md px-1.5 text-xs tabular-nums ${filter === f ? 'bg-teal-50 text-teal-700' : 'bg-slate-200/70 text-slate-500'}`}
                >
                  {countOf(f)}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full md:max-w-xs">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Search patient or reason"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search appointments"
            />
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No appointments found"
            text={q ? 'Try a different search or filter.' : `There are no ${filter === 'all' ? '' : filter + ' '}appointments yet.`}
            action={
              <button className="btn" onClick={() => setBooking(true)}>
                Book appointment
              </button>
            }
          />
        ) : (
          groups.map(([date, items]) => (
            <section key={date}>
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-2.5">
                <h3 className={`text-xs font-semibold uppercase tracking-wide ${date === today ? 'text-teal-700' : 'text-slate-500'}`}>
                  {dayLabel(date, today)}
                  {date !== today && <span className="ml-2 font-normal normal-case tracking-normal text-slate-400">{formatDate(date)}</span>}
                </h3>
                <span className="text-xs text-slate-400">
                  {items.length} visit{items.length === 1 ? '' : 's'}
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 transition hover:bg-slate-50/70"
                  >
                    <div className="flex w-[88px] shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold tabular-nums text-slate-900">
                      <Icon name="clock" className="h-3.5 w-3.5 text-slate-400" />
                      {formatTime(a.time)}
                    </div>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar name={nameOf(a.patientId)} size="md" />
                      <div className="min-w-0">
                        <div className={`truncate text-sm font-medium text-slate-900 ${a.status === 'cancelled' ? 'line-through decoration-slate-300' : ''}`}>
                          {nameOf(a.patientId)}
                        </div>
                        <div className="truncate text-sm text-slate-500">{a.reason}</div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                      <StatusBadge status={a.status} />
                      {a.status === 'scheduled' && (
                        <div className="flex gap-1">
                          <button className="btn-ghost text-emerald-700 hover:bg-emerald-50" onClick={() => update(a, 'completed')}>
                            <Icon name="check" className="h-4 w-4" />
                            Complete
                          </button>
                          <button className="btn-ghost text-rose-600 hover:bg-rose-50" onClick={() => update(a, 'cancelled')}>
                            <Icon name="x" className="h-4 w-4" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <Modal open={booking} onClose={() => setBooking(false)} title="Book appointment" description="Schedule a visit for an existing patient.">
        <BookingForm onDone={() => setBooking(false)} />
      </Modal>
    </div>
  )
}
