import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { today as getToday } from '../seed'
import StatusBadge, { statusStyles } from '../components/StatusBadge'
import Avatar from '../components/Avatar'
import Icon, { type IconName } from '../components/Icon'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import { BookingForm, PatientForm } from '../components/Forms'
import { useToast } from '../components/Toast'
import { formatDate, formatTime, greeting, isoDay, parseDay } from '../utils'
import type { Appointment, AppointmentStatus } from '../types'

const daysBetween = (a: string, b: string) => Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86400000)

function StatCard({ label, value, hint, icon, tone }: { label: string; value: string | number; hint: string; icon: IconName; tone: string }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  )
}

function WeekChart({ appointments }: { appointments: Appointment[] }) {
  const today = getToday()
  const start = parseDay(today)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7)) // Monday

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = isoDay(d)
    const items = appointments.filter((a) => a.date === iso && a.status !== 'cancelled')
    return { iso, label: d.toLocaleDateString('en-US', { weekday: 'short' }), count: items.length }
  })

  const max = Math.max(4, ...days.map((d) => d.count))
  const ticks = [max, Math.round(max / 2), 0]
  const total = days.reduce((s, d) => s + d.count, 0)

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Appointments this week</h2>
          <p className="mt-0.5 text-sm text-slate-500">Booked visits per day, excluding cancellations</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums text-slate-900">{total}</div>
          <div className="text-xs text-slate-500">this week</div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex h-44 flex-col justify-between pb-6 text-right text-[11px] tabular-nums text-slate-400">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">{t}</span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[152px] flex-col justify-between">
            {ticks.map((t) => (
              <div key={t} className={`border-t ${t === 0 ? 'border-slate-200' : 'border-dashed border-slate-100'}`} />
            ))}
          </div>
          <div className="relative flex h-44 items-end gap-2 sm:gap-3">
            {days.map((d) => {
              const isToday = d.iso === today
              return (
                <div key={d.iso} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                  <div className="flex h-[152px] w-full items-end justify-center">
                    <div
                      className={`w-full max-w-[36px] rounded-t transition-colors ${
                        isToday ? 'bg-teal-600' : 'bg-teal-500/30 group-hover:bg-teal-500/50'
                      }`}
                      style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 0 }}
                    />
                  </div>
                  <div className={`mt-2 h-4 text-xs ${isToday ? 'font-semibold text-teal-700' : 'text-slate-500'}`}>
                    {isToday ? 'Today' : d.label}
                  </div>
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lift transition group-hover:opacity-100">
                    <div className="font-medium">{formatDate(d.iso, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                    <div className="text-slate-300">
                      {d.count} appointment{d.count === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBreakdown({ appointments }: { appointments: Appointment[] }) {
  const statuses: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled']
  const total = appointments.length || 1

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-slate-900">Status overview</h2>
      <p className="mt-0.5 text-sm text-slate-500">All {appointments.length} appointments</p>
      <div className="mt-6 space-y-5">
        {statuses.map((s) => {
          const count = appointments.filter((a) => a.status === s).length
          const pct = Math.round((count / total) * 100)
          return (
            <div key={s}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 capitalize text-slate-700">
                  <span className={`h-2 w-2 rounded-full ${statusStyles[s].dot}`} />
                  {s}
                </span>
                <span className="tabular-nums text-slate-500">
                  <span className="font-medium text-slate-900">{count}</span> · {pct}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${statusStyles[s].dot}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { patients, appointments, setStatus } = useStore()
  const toast = useToast()
  const [modal, setModal] = useState<'booking' | 'patient' | null>(null)
  const today = getToday()

  const now = new Date().toTimeString().slice(0, 5)
  const todays = appointments.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time))
  const nextUp = todays.find((a) => a.status === 'scheduled' && a.time >= now)
  const upcoming = appointments.filter((a) => a.date > today && a.status === 'scheduled').length
  const completed = appointments.filter((a) => a.status === 'completed').length
  const closed = completed + appointments.filter((a) => a.status === 'cancelled').length
  const newThisMonth = patients.filter((p) => daysBetween(p.createdAt, today) <= 30).length
  const nameOf = (id: string) => patients.find((p) => p.id === id)?.name ?? 'Unknown'

  const recent = [...patients].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)

  const stats = [
    { label: 'Total patients', value: patients.length, hint: `+${newThisMonth} in the last 30 days`, icon: 'users', tone: 'bg-teal-50 text-teal-600' },
    {
      label: "Today's appointments",
      value: todays.length,
      hint: nextUp ? `Next at ${formatTime(nextUp.time)}` : 'No more visits today',
      icon: 'calendarCheck',
      tone: 'bg-sky-50 text-sky-600',
    },
    { label: 'Upcoming', value: upcoming, hint: 'Scheduled after today', icon: 'clock', tone: 'bg-violet-50 text-violet-600' },
    {
      label: 'Completion rate',
      value: closed ? `${Math.round((completed / closed) * 100)}%` : '—',
      hint: `${completed} visits completed`,
      icon: 'activity',
      tone: 'bg-emerald-50 text-emerald-600',
    },
  ] as const

  const complete = (a: Appointment) => {
    setStatus(a.id, 'completed')
    toast(`Visit with ${nameOf(a.patientId)} marked complete`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, Dr. Morgan`}
        subtitle={
          todays.length
            ? `You have ${todays.filter((a) => a.status === 'scheduled').length} visits left on today's schedule.`
            : 'Your schedule is clear today.'
        }
        actions={
          <>
            <button className="btn-secondary" onClick={() => setModal('patient')}>
              <Icon name="plus" className="h-4 w-4" />
              Add patient
            </button>
            <button className="btn" onClick={() => setModal('booking')}>
              <Icon name="calendar" className="h-4 w-4" />
              Book appointment
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Today's schedule</h2>
              <p className="mt-0.5 text-sm text-slate-500">{formatDate(today, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <Link to="/appointments" className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
              View all
              <Icon name="chevronRight" className="h-4 w-4" />
            </Link>
          </div>
          {todays.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No appointments today"
              text="Enjoy the quiet, or book a visit to fill the schedule."
              action={
                <button className="btn" onClick={() => setModal('booking')}>
                  Book appointment
                </button>
              }
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {todays.map((a) => {
                const isNext = a.id === nextUp?.id
                return (
                  <li
                    key={a.id}
                    className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 transition hover:bg-slate-50/70 ${
                      a.status === 'cancelled' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="w-[72px] shrink-0">
                      <div className="whitespace-nowrap text-sm font-semibold tabular-nums text-slate-900">{formatTime(a.time)}</div>
                      {isNext && <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-600">Up next</div>}
                    </div>
                    <span className={`hidden h-10 w-1 rounded-full md:block ${isNext ? 'bg-teal-500' : 'bg-slate-100'}`} />
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar name={nameOf(a.patientId)} size="md" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-900">{nameOf(a.patientId)}</div>
                        <div className="truncate text-sm text-slate-500">{a.reason}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.status === 'scheduled' && (
                        <button className="btn-ghost text-emerald-700 hover:bg-emerald-50" onClick={() => complete(a)}>
                          <Icon name="check" className="h-4 w-4" />
                          <span className="hidden sm:inline">Complete</span>
                        </button>
                      )}
                      <span className={a.status === 'scheduled' ? 'hidden sm:inline-flex' : 'inline-flex'}>
                        <StatusBadge status={a.status} />
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Recent patients</h2>
              <p className="mt-0.5 text-sm text-slate-500">Newest registrations</p>
            </div>
            <Link to="/patients" className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
              All
              <Icon name="chevronRight" className="h-4 w-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon="users" title="No patients yet" text="Add your first patient to get started." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((p) => {
                const ago = daysBetween(p.createdAt, today)
                return (
                  <li key={p.id} className="flex items-center gap-3 px-6 py-3.5">
                    <Avatar name={p.name} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-900">{p.name}</div>
                      <div className="truncate text-xs text-slate-500">{p.email || p.phone || 'No contact info'}</div>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {ago === 0 ? 'Today' : ago === 1 ? 'Yesterday' : `${ago}d ago`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeekChart appointments={appointments} />
        </div>
        <StatusBreakdown appointments={appointments} />
      </div>

      <Modal open={modal === 'booking'} onClose={() => setModal(null)} title="Book appointment" description="Schedule a visit for an existing patient.">
        <BookingForm onDone={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'patient'} onClose={() => setModal(null)} title="Add patient" description="Create a new patient record.">
        <PatientForm onDone={() => setModal(null)} />
      </Modal>
    </div>
  )
}
