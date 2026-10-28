import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Appointment, Patient } from './types'
import { seedAppointments, seedPatients, today } from './seed'

const KEY = 'caredesk-data-v2'

interface Data {
  patients: Patient[]
  appointments: Appointment[]
}

interface Store extends Data {
  addPatient: (p: Omit<Patient, 'id' | 'createdAt'>) => void
  removePatient: (id: string) => void
  addAppointment: (a: Omit<Appointment, 'id' | 'status'>) => void
  setStatus: (id: string, status: Appointment['status']) => void
  resetDemo: () => void
}

const StoreContext = createContext<Store | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10)
const demo = (): Data => ({ patients: seedPatients(), appointments: seedAppointments() })

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore and fall back to demo data
  }
  return demo()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      // storage unavailable; keep in memory only
    }
  }, [data])

  const store: Store = {
    ...data,
    addPatient: (p) =>
      setData((d) => ({ ...d, patients: [{ ...p, id: uid(), createdAt: today() }, ...d.patients] })),
    removePatient: (id) =>
      setData((d) => ({
        patients: d.patients.filter((p) => p.id !== id),
        appointments: d.appointments.filter((a) => a.patientId !== id),
      })),
    addAppointment: (a) =>
      setData((d) => ({ ...d, appointments: [...d.appointments, { ...a, id: uid(), status: 'scheduled' }] })),
    setStatus: (id, status) =>
      setData((d) => ({
        ...d,
        appointments: d.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
      })),
    resetDemo: () => setData(demo()),
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
