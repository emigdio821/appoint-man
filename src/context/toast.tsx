import { ToastOptions } from '@/types'
import RadixToast from '@/components/Toast'
import { createContext, useContext, useState } from 'react'
import { Provider as PrimitiveProvider, Viewport } from '@radix-ui/react-toast'

interface ToastContextValue {
  showToast: (options: ToastOptions) => void
}

interface ToastProviderProps {
  children: React.ReactNode
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
})

export const useToastManager = (): ToastContextValue => useContext(ToastContext)

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Map<string, ToastOptions>>(new Map())

  const showToast = (options: ToastOptions) => {
    setToasts((prevToasts) => {
      const toastsMap = new Map(prevToasts)
      toastsMap.set(String(Date.now()), { ...options })
      return toastsMap
    })
  }

  const handleRemoveToast = (isOpen: boolean, toastId: string) => {
    if (!isOpen) {
      toasts.delete(toastId)
    }
  }

  const contextValue: ToastContextValue = {
    showToast,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      <PrimitiveProvider swipeDirection="right" swipeThreshold={60}>
        {children}
        {Array.from(toasts).map(([key, toast]) => (
          <RadixToast
            key={key}
            title={toast.title}
            action={toast.action}
            description={toast.description}
            onOpenChange={(isOpen: boolean) => handleRemoveToast(isOpen, key)}
          />
        ))}
        <Viewport className="toast-viewport" />
      </PrimitiveProvider>
    </ToastContext.Provider>
  )
}
