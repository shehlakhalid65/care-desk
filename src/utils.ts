const palette = [
  'bg-teal-100 text-teal-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-emerald-100 text-emerald-700',
  'bg-indigo-100 text-indigo-700',
]

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

export const avatarColor = (seed: string) => {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return palette[h % palette.length]
}

export const parseDay = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const isoDay = (d: Date) => d.toLocaleDateString('en-CA')

export const formatDate = (
  iso: string,
  opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
) => (iso ? parseDay(iso).toLocaleDateString('en-US', opts) : '—')

export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export const ageFrom = (dob: string) => {
  if (!dob) return null
  const b = parseDay(dob)
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age--
  return age
}

export const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
