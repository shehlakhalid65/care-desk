export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  createdAt: string
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  patientId: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  reason: string
  status: AppointmentStatus
}
