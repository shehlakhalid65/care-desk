import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import Icon from './Icon'

interface ToastItem {
  id: number
  message: string
}

const ToastContext = createContext<(message: string) => void>(() => {})

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string) => {
    const id = ++nextId
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex animate-pop-in items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lift"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
              <Icon name="check" className="h-3 w-3" />
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
