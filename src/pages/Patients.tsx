import { useState } from 'react'
import { useStore } from '../store'
import { today } from '../seed'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import { BookingForm, PatientForm } from '../components/Forms'
import { useToast } from '../components/Toast'
import { ageFrom, formatDate, formatTime } from '../utils'

export default function Patients() {
  const { patients, appointments, removePatient } = useStore()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [bookingFor, setBookingFor] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const filtered = patients.filter((p) => `${p.name} ${p.email} ${p.phone}`.toLowerCase().includes(q))

  const nextVisit = (id: string) =>
    appointments
      .filter((a) => a.patientId === id && a.status === 'scheduled' && a.date >= today())
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0]
  const visits = (id: string) => appointments.filter((a) => a.patientId === id && a.status === 'completed').length

  const remove = (id: string, name: string) => {
    if (!confirm(`Remove ${name}? Their appointments will also be deleted.`)) return
    removePatient(id)
    toast(`${name} removed`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        subtitle={`${patients.length} registered patients`}
        actions={
          <button className="btn" onClick={() => setAdding(true)}>
            <Icon name="plus" className="h-4 w-4" />
            Add patient
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Search name, email or phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search patients"
            />
          </div>
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{filtered.length}</span> of {patients.length}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={patients.length ? 'search' : 'users'}
            title={patients.length ? 'No matching patients' : 'No patients yet'}
            text={patients.length ? `Nothing matches “${query}”. Try a different search.` : 'Add your first patient to get started.'}
            action={
              patients.length ? (
                <button className="btn-secondary" onClick={() => setQuery('')}>
                  Clear search
                </button>
              ) : (
                <button className="btn" onClick={() => setAdding(true)}>
                  Add patient
                </button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="th">Patient</th>
                  <th className="th">Phone</th>
                  <th className="th">Date of birth</th>
                  <th className="th">Visits</th>
                  <th className="th">Next appointment</th>
                  <th className="th" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const next = nextVisit(p.id)
                  const age = ageFrom(p.dob)
                  return (
                    <tr key={p.id} className="group transition hover:bg-slate-50/70">
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.name} size="md" />
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900">{p.name}</div>
                            <div className="text-slate-500">{p.email || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="td whitespace-nowrap text-slate-600">{p.phone || '—'}</td>
                      <td className="td whitespace-nowrap text-slate-600">
                        {formatDate(p.dob)}
                        {age !== null && <span className="ml-1.5 text-slate-400">({age} yrs)</span>}
                      </td>
                      <td className="td tabular-nums text-slate-600">{visits(p.id)}</td>
                      <td className="td whitespace-nowrap">
                        {next ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-700">
                            <Icon name="calendar" className="h-3.5 w-3.5 text-teal-600" />
                            {next.date === today() ? 'Today' : formatDate(next.date, { month: 'short', day: 'numeric' })},{' '}
                            {formatTime(next.time)}
                          </span>
                        ) : (
                          <span className="text-slate-400">None scheduled</span>
                        )}
                      </td>
                      <td className="td">
                        <div className="flex justify-end gap-1">
                          <button className="btn-ghost text-teal-700 hover:bg-teal-50" onClick={() => setBookingFor(p.id)}>
                            Book
                          </button>
                          <button
                            className="icon-btn hover:bg-rose-50 hover:text-rose-600"
                            onClick={() => remove(p.id, p.name)}
                            aria-label={`Remove ${p.name}`}
                            title="Remove patient"
                          >
                            <Icon name="trash" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add patient" description="Create a new patient record.">
        <PatientForm onDone={() => setAdding(false)} />
      </Modal>
      <Modal
        open={bookingFor !== null}
        onClose={() => setBookingFor(null)}
        title="Book appointment"
        description={`Schedule a visit for ${patients.find((p) => p.id === bookingFor)?.name ?? 'this patient'}.`}
      >
        {bookingFor && <BookingForm patientId={bookingFor} onDone={() => setBookingFor(null)} />}
      </Modal>
    </div>
  )
}
