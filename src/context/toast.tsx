import { ToastOptions } from '@/types'
import RadixToast from '@/components/Toast'
import { createContext, useContext, useState } from 'react'
import { Provider as PrimitiveProvider, Viewport } from '@radix-ui/react-toast'

interface ToastContextValue {
  showToast: (options: ToastOptions) => void
}

interface ToastProviderProps {
  children: React.ReactElement
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
})

export const useToastManager = () => useContext(ToastContext)
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([])

  function showToast(options: ToastOptions) {
    setToasts((prevToasts) => [...prevToasts, options])
  }

  const contextValue: ToastContextValue = {
    showToast,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      <PrimitiveProvider swipeDirection="right" swipeThreshold={60}>
        {children}
        {toasts.map((toast, index) => (
          <RadixToast
            key={index}
            title={toast.title}
            action={toast.action}
            description={toast.description}
          />
        ))}
        <Viewport className="toast-viewport" />
      </PrimitiveProvider>
    </ToastContext.Provider>
  )
}
