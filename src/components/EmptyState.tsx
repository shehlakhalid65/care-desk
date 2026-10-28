import type { ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

export default function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
