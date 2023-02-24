import { forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { BiX } from 'react-icons/bi'

type DialogContentProps = {
  title?: string
  className?: string
  description?: string
  children: React.ReactNode
} & React.ComponentProps<typeof DialogPrimitive.Content>

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, title, description, ...props }, forwardedRef) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 animate-overlayShow overflow-y-auto bg-blackA11 backdrop-blur-sm" />
      <DialogPrimitive.Content
        {...props}
        ref={forwardedRef}
        className="fixed top-2/4 left-2/4 w-[90vw] max-w-md -translate-x-2/4 -translate-y-2/4 animate-contentShow rounded-md bg-white p-6 pt-8 shadow-md focus:outline-none data-[state=closed]:animate-contentHide dark:bg-zinc-900"
      >
        {title && (
          <DialogPrimitive.Title className="text-lg font-semibold">
            {title}
          </DialogPrimitive.Title>
        )}
        {description && (
          <DialogPrimitive.Description className="text-sm leading-tight opacity-70">
            {description}
          </DialogPrimitive.Description>
        )}
        {children}
        <DialogPrimitive.Close
          asChild
          aria-label="Close"
          className="dialog-close-btn"
        >
          <button className="outline-none">
            <BiX />
          </button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
)
DialogContent.displayName = 'DialogContent'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
