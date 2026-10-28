import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, description, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg animate-pop-in rounded-2xl bg-white shadow-lift"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button className="icon-btn -mr-2" onClick={onClose} aria-label="Close">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
