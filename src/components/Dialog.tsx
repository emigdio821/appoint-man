import { BiX } from 'react-icons/bi'
import * as DialogPrimitive from '@radix-ui/react-dialog'

interface DialogProps {
  title: string
  isOpen: boolean
  description?: string
  onClose?: () => void
  trigger?: React.ReactNode
  children: React.ReactNode
  setIsOpen: (opt: boolean) => void
}

export default function Dialog({
  title,
  isOpen,
  trigger,
  onClose,
  children,
  setIsOpen,
  description,
}: DialogProps) {
  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(opened) => {
        if (!opened && onClose) {
          onClose()
        }
        setIsOpen(opened)
      }}
    >
      {trigger && (
        <DialogPrimitive.Trigger asChild onClick={() => setIsOpen(true)}>
          {trigger}
        </DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 animate-overlayShow bg-blackA9 backdrop-blur-sm" />
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed top-2/4 left-2/4 max-h-[85vh] w-[90vw] max-w-md -translate-x-2/4 -translate-y-2/4 animate-contentShow rounded-md bg-white p-6 shadow-md focus:outline-none data-[state=closed]:animate-contentHide dark:bg-zinc-900"
        >
          <DialogPrimitive.Title className="text-lg font-semibold">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="text-sm leading-tight opacity-70">
              {description}
            </DialogPrimitive.Description>
          )}

          {children}
          <DialogPrimitive.Close asChild className="dialog-close-btn">
            <button className="outline-none">
              <BiX />
            </button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
