import { useState, type FormEvent } from 'react'
import { useStore } from '../store'
import { today } from '../seed'
import { useToast } from './Toast'

const reasons = ['General consultation', 'Annual check-up', 'Follow-up visit', 'Lab results review', 'Vaccination']

export function BookingForm({ onDone, patientId = '' }: { onDone: () => void; patientId?: string }) {
  const { patients, addAppointment } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ patientId, date: today(), time: '09:00', reason: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    addAppointment({ ...form, reason: form.reason.trim() })
    const name = patients.find((p) => p.id === form.patientId)?.name
    toast(`Appointment booked for ${name}`)
    onDone()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="b-patient">Patient</label>
        <select
          id="b-patient"
          className="input"
          required
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        >
          <option value="">Select a patient…</option>
          {[...patients]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="b-date">Date</label>
          <input
            id="b-date"
            className="input"
            type="date"
            required
            min={today()}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="b-time">Time</label>
          <input
            id="b-time"
            className="input"
            type="time"
            required
            step={900}
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="b-reason">Reason for visit</label>
        <input
          id="b-reason"
          className="input"
          required
          placeholder="e.g. Follow-up visit"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {reasons.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, reason: r })}
              className={`rounded-full border px-2.5 py-1 text-xs transition ${
                form.reason === r
                  ? 'border-teal-200 bg-teal-50 text-teal-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" className="btn-secondary" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn">
          Book appointment
        </button>
      </div>
    </form>
  )
}

const fields = [
  ['name', 'Full name', 'text', 'Jane Cooper'],
  ['email', 'Email', 'email', 'jane@example.com'],
  ['phone', 'Phone', 'tel', '(555) 010-0000'],
  ['dob', 'Date of birth', 'date', ''],
] as const

export function PatientForm({ onDone }: { onDone: () => void }) {
  const { addPatient } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addPatient({ ...form, name: form.name.trim() })
    toast(`${form.name.trim()} added to patients`)
    onDone()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label, type, placeholder]) => (
          <div key={key} className={key === 'name' ? 'sm:col-span-2' : ''}>
            <label className="label" htmlFor={`p-${key}`}>
              {label}
            </label>
            <input
              id={`p-${key}`}
              className="input"
              type={type}
              placeholder={placeholder}
              required={key === 'name'}
              max={key === 'dob' ? today() : undefined}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" className="btn-secondary" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn">
          Save patient
        </button>
      </div>
    </form>
  )
}
