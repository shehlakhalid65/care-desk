import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../store'
import { useToast } from './Toast'
import Icon, { type IconName } from './Icon'
import { today } from '../seed'
import { formatDate } from '../utils'

const links: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/patients', label: 'Patients', icon: 'users' },
  { to: '/appointments', label: 'Appointments', icon: 'calendar' },
]

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="" className="h-9 w-9 rounded-xl shadow-sm shadow-teal-600/30" />
      <div className="leading-tight">
        <div className="text-[15px] font-semibold text-slate-900">CareDesk</div>
        <div className="text-xs text-slate-500">Clinic workspace</div>
      </div>
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { patients, appointments, resetDemo } = useStore()
  const toast = useToast()
  const scheduled = appointments.filter((a) => a.status === 'scheduled' && a.date >= today()).length

  const counts: Record<string, number | undefined> = { '/patients': patients.length, '/appointments': scheduled }

  const reset = () => {
    if (!confirm('Restore the sample data? Your changes will be lost.')) return
    resetDemo()
    toast('Demo data restored')
  }

  return (
    <div className="flex h-full flex-col bg-white px-4 py-5">
      <div className="px-2">
        <Brand />
      </div>

      <div className="mt-8 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu</div>
      <nav className="mt-2 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={l.icon} className={`h-[18px] w-[18px] ${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                <span className="flex-1">{l.label}</span>
                {counts[l.to] !== undefined && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${
                      isActive ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {counts[l.to]}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
          </span>
          Demo mode
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">Data is saved in your browser. Reset anytime to restore the samples.</p>
        <button onClick={reset} className="btn-secondary mt-3 w-full py-2 text-xs">
          <Icon name="refresh" className="h-3.5 w-3.5" />
          Reset demo data
        </button>
      </div>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200/80 lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 animate-slide-in shadow-lift">
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
                <Icon name="menu" />
              </button>
              <div className="lg:hidden">
                <Brand />
              </div>
              <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex">
                <Icon name="calendar" className="h-4 w-4 text-slate-400" />
                {formatDate(today(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right leading-tight sm:block">
                <div className="text-sm font-medium text-slate-900">Dr. Alex Morgan</div>
                <div className="text-xs text-slate-500">Riverside Family Clinic</div>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                AM
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
