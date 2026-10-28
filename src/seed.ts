import type { Appointment, Patient } from './types'

const day = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString('en-CA') // YYYY-MM-DD in local time
}

export const today = () => day(0)

export const seedPatients = (): Patient[] => [
  { id: 'p8', name: 'Noah Martinez', email: 'noah.m@example.com', phone: '(555) 010-1108', dob: '1971-12-09', createdAt: day(-1) },
  { id: 'p4', name: 'Aisha Khan', email: 'aisha.k@example.com', phone: '(555) 010-1104', dob: '1996-07-08', createdAt: day(-3) },
  { id: 'p7', name: 'Olivia Brown', email: 'olivia.b@example.com', phone: '(555) 010-1107', dob: '1993-06-25', createdAt: day(-7) },
  { id: 'p3', name: 'Maria Garcia', email: 'maria.g@example.com', phone: '(555) 010-1103', dob: '1978-01-30', createdAt: day(-12) },
  { id: 'p6', name: 'Daniel Kim', email: 'daniel.k@example.com', phone: '(555) 010-1106', dob: '2001-03-17', createdAt: day(-18) },
  { id: 'p2', name: 'Emily Davis', email: 'emily.d@example.com', phone: '(555) 010-1102', dob: '1985-09-23', createdAt: day(-25) },
  { id: 'p1', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '(555) 010-1101', dob: '1990-04-12', createdAt: day(-40) },
  { id: 'p5', name: 'James Wilson', email: 'james.w@example.com', phone: '(555) 010-1105', dob: '1962-11-02', createdAt: day(-60) },
]

export const seedAppointments = (): Appointment[] => [
  { id: 'a1', patientId: 'p1', date: day(0), time: '09:30', reason: 'Annual check-up', status: 'scheduled' },
  { id: 'a2', patientId: 'p2', date: day(0), time: '11:00', reason: 'Follow-up visit', status: 'scheduled' },
  { id: 'a3', patientId: 'p5', date: day(0), time: '13:45', reason: 'Blood pressure review', status: 'scheduled' },
  { id: 'a4', patientId: 'p7', date: day(0), time: '16:15', reason: 'Prescription renewal', status: 'scheduled' },
  { id: 'a5', patientId: 'p3', date: day(1), time: '14:15', reason: 'Lab results review', status: 'scheduled' },
  { id: 'a6', patientId: 'p6', date: day(1), time: '10:00', reason: 'Sports injury', status: 'scheduled' },
  { id: 'a7', patientId: 'p8', date: day(2), time: '09:00', reason: 'New patient intake', status: 'scheduled' },
  { id: 'a8', patientId: 'p4', date: day(3), time: '15:30', reason: 'Allergy consultation', status: 'scheduled' },
  { id: 'a9', patientId: 'p4', date: day(-2), time: '10:00', reason: 'Consultation', status: 'completed' },
  { id: 'a10', patientId: 'p1', date: day(-5), time: '15:45', reason: 'Vaccination', status: 'cancelled' },
  { id: 'a11', patientId: 'p5', date: day(-1), time: '08:30', reason: 'ECG screening', status: 'completed' },
  { id: 'a12', patientId: 'p2', date: day(-1), time: '12:00', reason: 'Physiotherapy', status: 'completed' },
  { id: 'a13', patientId: 'p6', date: day(-3), time: '11:30', reason: 'General consultation', status: 'completed' },
  { id: 'a14', patientId: 'p3', date: day(-4), time: '09:15', reason: 'Diabetes follow-up', status: 'completed' },
  { id: 'a15', patientId: 'p7', date: day(-6), time: '14:00', reason: 'Skin check', status: 'completed' },
  { id: 'a16', patientId: 'p8', date: day(-2), time: '16:30', reason: 'Flu symptoms', status: 'cancelled' },
]
