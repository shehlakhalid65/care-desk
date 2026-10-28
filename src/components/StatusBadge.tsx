import type { AppointmentStatus } from '../types'

export const statusStyles: Record<AppointmentStatus, { badge: string; dot: string }> = {
  scheduled: { badge: 'bg-sky-50 text-sky-700 ring-sky-600/15', dot: 'bg-sky-500' },
  completed: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15', dot: 'bg-emerald-500' },
  cancelled: { badge: 'bg-rose-50 text-rose-700 ring-rose-600/15', dot: 'bg-rose-500' },
}

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const s = statusStyles[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${s.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}
